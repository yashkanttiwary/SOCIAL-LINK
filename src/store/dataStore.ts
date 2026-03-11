import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { analyzeTopicWithProvider } from '../lib/aiClient';
import { syncYoutubeChannel } from '../lib/youtubeClient';

export interface Project { id: number; title: string; status: 'Ideation' | 'Research' | 'Filming' | 'Editing' | 'Scheduled' | 'Published'; targetDate: string; priority: 'Low' | 'Medium' | 'High' | 'Urgent'; aiState: 'AI-Drafted' | 'AI-Optimized' | 'Researching' | 'Completed'; }
export interface Competitor { id: number; name: string; subscribers: number; growthPct: number; frequencyPerWeek: number; keywords: string[]; }
export interface TrendItem { id: number; name: string; category: string; growthPct: number; momentum: 'Breakout' | 'Growing' | 'Steady' | 'Declining'; }
export interface ActivityItem { id: number; text: string; status: 'done' | 'running' | 'queued'; timestamp: number; }
export interface Snapshot { date: string; views: number; subs: number; revenue: number; }
export interface CanvasItem { id: number; text: string; kind: 'sticky' | 'text'; color: string; x: number; y: number; r: number; }
export interface CanvasConnection { id: number; fromId: number; toId: number; }
export interface RuleConstraint { id: number; type: 'must_include' | 'must_avoid' | 'prefer'; title: string; desc: string; }
export interface RuleBookState { goal: string; personaAge: string; personaMotivation: string; toggles: Record<string, boolean>; constraints: RuleConstraint[]; updatedAt: number; }
export interface AiReport { topic: string; searchInterestPct: number; searchVolume: number; competition: number; emergingTopics: string[]; geography: Array<{ country: string; pct: number }>; activeHours: number[]; }

interface DataState {
  channelName: string | null;
  projects: Project[]; competitors: Competitor[]; trends: TrendItem[]; snapshots: Snapshot[]; activities: ActivityItem[]; report: AiReport;
  canvasItems: CanvasItem[]; canvasConnections: CanvasConnection[]; ruleBook: RuleBookState;
  refreshIntervalMinutes: 1 | 2; lastRefreshedAt: number;
  runAnalysis: (query: string) => Promise<void>; syncConnectedChannel: () => Promise<void>; addCompetitor: (name: string) => void; addProject: (title: string) => void;
  setRefreshIntervalMinutes: (minutes: 1 | 2) => void; autoRefresh: () => void;
  addCanvasItem: (item: Omit<CanvasItem, 'id'>) => number; updateCanvasItem: (id: number, patch: Partial<CanvasItem>) => void;
  removeCanvasItem: (id: number) => void; addCanvasConnection: (fromId: number, toId: number) => void; addTopicToCanvas: () => void;
  updateRuleBook: (patch: Partial<RuleBookState>) => void; addConstraint: (constraint: Omit<RuleConstraint, 'id'>) => void;
  updateConstraint: (id: number, patch: Partial<RuleConstraint>) => void; removeConstraint: (id: number) => void;
}

const STORAGE_KEY = 'social-link-data-v4';
const initialState = {
  channelName: null,
  projects: [] as Project[],
  competitors: [] as Competitor[],
  trends: [] as TrendItem[],
  snapshots: [] as Snapshot[],
  activities: [] as ActivityItem[],
  report: { topic: '', searchInterestPct: 0, searchVolume: 0, competition: 0, emergingTopics: [], geography: [], activeHours: [] } as AiReport,
  canvasItems: [] as CanvasItem[],
  canvasConnections: [] as CanvasConnection[],
  ruleBook: {
    goal: 'brand', personaAge: '', personaMotivation: '', toggles: { trending: true, sfw: false, factcheck: true, longform: false }, constraints: [], updatedAt: Date.now(),
  } as RuleBookState,
  refreshIntervalMinutes: 1 as 1 | 2,
  lastRefreshedAt: 0,
};

const hydrate = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState;
  try { return { ...initialState, ...JSON.parse(raw) }; } catch { return initialState; }
};

const persist = (state: DataState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const useDataStore = create<DataState>((set) => ({
  ...hydrate(),

  runAnalysis: async (query) => {
    const clean = query.trim() || 'Untitled topic';
    const auth = useAuthStore.getState();

    set((state) => {
      const next = { ...state, activities: [{ id: Date.now(), text: `Running AI analysis via ${auth.provider}/${auth.model}`, status: 'running' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8) };
      persist(next as DataState);
      return next;
    });

    try {
      const report = await analyzeTopicWithProvider(clean, { provider: auth.provider, model: auth.model, apiKey: auth.apiKey });
      set((state) => {
        const next = { ...state, report, activities: [{ id: Date.now(), text: `Analyzed "${clean}" via ${auth.provider}:${auth.model}`, status: 'done' as const, timestamp: Date.now() }, ...state.activities.filter((a) => a.status !== 'running')].slice(0, 8) };
        persist(next as DataState);
        return next;
      });
    } catch (error) {
      set((state) => {
        const next = { ...state, activities: [{ id: Date.now(), text: `AI call failed (${String(error)}). Check API key/provider/model.`, status: 'queued' as const, timestamp: Date.now() }, ...state.activities.filter((a) => a.status !== 'running')].slice(0, 8) };
        persist(next as DataState);
        return next;
      });
    }
  },

  syncConnectedChannel: async () => {
    const auth = useAuthStore.getState();
    if (!auth.youtubeApiKey.trim() || !auth.channelInput.trim()) {
      set((state) => {
        const next = { ...state, activities: [{ id: Date.now(), text: 'Set YouTube API key + channel URL/handle in Settings before syncing.', status: 'queued' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8) };
        persist(next as DataState);
        return next;
      });
      return;
    }

    set((state) => {
      const next = { ...state, activities: [{ id: Date.now(), text: 'Syncing channel data from YouTube Data API...', status: 'running' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8) };
      persist(next as DataState);
      return next;
    });

    try {
      const synced = await syncYoutubeChannel(auth.channelInput, auth.youtubeApiKey);
      const snapshots: Snapshot[] = [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), views: synced.totalViews, subs: synced.subscribers, revenue: 0 }];
      const projects: Project[] = synced.videos.map((v, idx) => ({
        id: Date.now() + idx,
        title: v.title,
        status: 'Published',
        targetDate: new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        priority: 'Medium',
        aiState: 'Completed',
      }));
      const tags = synced.videos.flatMap((v) => v.title.split(' ').filter((w) => w.length > 4).slice(0, 2)).slice(0, 4).map((w) => `#${w.replace(/[^a-zA-Z0-9]/g, '')}`);

      set((state) => {
        const next = {
          ...state,
          channelName: synced.channelName,
          snapshots,
          projects,
          report: { ...state.report, topic: synced.channelName, emergingTopics: tags, searchVolume: state.report.searchVolume || 0 },
          lastRefreshedAt: Date.now(),
          activities: [{ id: Date.now(), text: `Synced ${synced.channelName}: ${synced.videos.length} videos loaded`, status: 'done' as const, timestamp: Date.now() }, ...state.activities.filter((a) => a.status !== 'running')].slice(0, 8),
        };
        persist(next as DataState);
        return next;
      });
    } catch (error) {
      set((state) => {
        const next = { ...state, activities: [{ id: Date.now(), text: `YouTube sync failed (${String(error)}).`, status: 'queued' as const, timestamp: Date.now() }, ...state.activities.filter((a) => a.status !== 'running')].slice(0, 8) };
        persist(next as DataState);
        return next;
      });
    }
  },

  addCompetitor: (name) => set((state) => {
    const clean = name.trim(); if (!clean) return state;
    const next = { ...state, competitors: [{ id: Date.now(), name: clean, subscribers: 0, growthPct: 0, frequencyPerWeek: 0, keywords: [] }, ...state.competitors] };
    persist(next as DataState); return next;
  }),
  addProject: (title) => set((state) => {
    const clean = title.trim(); if (!clean) return state;
    const next = { ...state, projects: [{ id: Date.now(), title: clean, status: 'Research' as const, targetDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), priority: 'Medium' as const, aiState: 'AI-Drafted' as const }, ...state.projects] };
    persist(next as DataState); return next;
  }),
  setRefreshIntervalMinutes: (minutes) => set((state) => { const next = { ...state, refreshIntervalMinutes: minutes }; persist(next as DataState); return next; }),
  autoRefresh: () => set((state) => {
    if (!state.snapshots.length) return state;
    const next = { ...state, lastRefreshedAt: Date.now(), activities: [{ id: Date.now(), text: 'Checked for new channel data snapshot.', status: 'done' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8) };
    persist(next as DataState); return next;
  }),
  addCanvasItem: (item) => { const id = Date.now(); set((state) => { const next = { ...state, canvasItems: [...state.canvasItems, { ...item, id }] }; persist(next as DataState); return next; }); return id; },
  updateCanvasItem: (id, patch) => set((state) => { const next = { ...state, canvasItems: state.canvasItems.map((i) => (i.id === id ? { ...i, ...patch } : i)) }; persist(next as DataState); return next; }),
  removeCanvasItem: (id) => set((state) => { const next = { ...state, canvasItems: state.canvasItems.filter((i) => i.id !== id), canvasConnections: state.canvasConnections.filter((c) => c.fromId !== id && c.toId !== id) }; persist(next as DataState); return next; }),
  addCanvasConnection: (fromId, toId) => set((state) => { if (fromId === toId) return state; const next = { ...state, canvasConnections: [...state.canvasConnections, { id: Date.now(), fromId, toId }] }; persist(next as DataState); return next; }),
  addTopicToCanvas: () => set((state) => { const next = { ...state, canvasItems: [...state.canvasItems, { id: Date.now(), text: `AI topic: ${state.report.topic || 'Untitled'}`, kind: 'sticky' as const, color: 'bg-purple-200 text-purple-900', x: 600, y: 180, r: -1 }] }; persist(next as DataState); return next; }),
  updateRuleBook: (patch) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, ...patch, updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  addConstraint: (constraint) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: [...state.ruleBook.constraints, { ...constraint, id: Date.now() }], updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  updateConstraint: (id, patch) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: state.ruleBook.constraints.map((c) => (c.id === id ? { ...c, ...patch } : c)), updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  removeConstraint: (id) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: state.ruleBook.constraints.filter((c) => c.id !== id), updatedAt: Date.now() } }; persist(next as DataState); return next; }),
}));
