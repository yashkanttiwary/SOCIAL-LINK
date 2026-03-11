import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { analyzeTopicWithProvider } from '../lib/aiClient';

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
  projects: Project[]; competitors: Competitor[]; trends: TrendItem[]; snapshots: Snapshot[]; activities: ActivityItem[]; report: AiReport;
  canvasItems: CanvasItem[]; canvasConnections: CanvasConnection[]; ruleBook: RuleBookState;
  refreshIntervalMinutes: 1 | 2; lastRefreshedAt: number;
  runAnalysis: (query: string) => Promise<void>; addCompetitor: (name: string) => void; addProject: (title: string) => void;
  setRefreshIntervalMinutes: (minutes: 1 | 2) => void; autoRefresh: () => void;
  addCanvasItem: (item: Omit<CanvasItem, 'id'>) => number; updateCanvasItem: (id: number, patch: Partial<CanvasItem>) => void;
  removeCanvasItem: (id: number) => void; addCanvasConnection: (fromId: number, toId: number) => void; addTopicToCanvas: () => void;
  updateRuleBook: (patch: Partial<RuleBookState>) => void; addConstraint: (constraint: Omit<RuleConstraint, 'id'>) => void;
  updateConstraint: (id: number, patch: Partial<RuleConstraint>) => void; removeConstraint: (id: number) => void;
}

const STORAGE_KEY = 'social-link-data-v3';
const now = new Date();
const plusDays = (days: number) => { const d = new Date(now); d.setDate(now.getDate() + days); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };

const initialState = {
  projects: [
    { id: 1, title: 'AI creator workflow for solo teams', status: 'Ideation', targetDate: plusDays(1), priority: 'High', aiState: 'AI-Drafted' },
    { id: 2, title: 'iPhone 15 Pro Max long-term review', status: 'Filming', targetDate: plusDays(3), priority: 'Urgent', aiState: 'AI-Optimized' },
    { id: 3, title: 'How to build repeatable thumbnail systems', status: 'Editing', targetDate: plusDays(5), priority: 'Medium', aiState: 'Researching' },
    { id: 4, title: 'Prompt engineering mistakes to avoid', status: 'Published', targetDate: plusDays(-1), priority: 'Low', aiState: 'Completed' },
  ] as Project[],
  competitors: [
    { id: 1, name: 'TechReview Pro', subscribers: 1200000, growthPct: 12.4, frequencyPerWeek: 3, keywords: ['#iPhone15', '#Gadgets', '#Setup'] },
    { id: 2, name: 'Future Logic', subscribers: 840000, growthPct: 8.2, frequencyPerWeek: 2, keywords: ['#AI', '#MachineLearning', '#FutureTech'] },
    { id: 3, name: 'Code With Sam', subscribers: 2500000, growthPct: -2.1, frequencyPerWeek: 7, keywords: ['#Python', '#ReactJS', '#Tailwind'] },
  ] as Competitor[],
  trends: [
    { id: 1, name: 'Vision Pro long-term reviews', category: 'Hardware', growthPct: 135, momentum: 'Breakout' },
    { id: 2, name: 'Low-code AI app development', category: 'Software', growthPct: 120, momentum: 'Growing' },
    { id: 3, name: 'Custom keyboard productivity rigs', category: 'Accessories', growthPct: 14, momentum: 'Steady' },
  ] as TrendItem[],
  snapshots: Array.from({ length: 30 }).map((_, i) => ({ date: `Day ${i + 1}`, views: 20000 + i * 800 + Math.floor(Math.random() * 3000), subs: 80 + i * 4 + Math.floor(Math.random() * 25), revenue: 110 + i * 5 + Math.floor(Math.random() * 35) })) as Snapshot[],
  activities: [
    { id: 1, text: 'Loaded channel baseline metrics from cache', status: 'done' as const, timestamp: Date.now() - 15000 },
    { id: 2, text: 'Scanned competitor upload cadence', status: 'done' as const, timestamp: Date.now() - 8000 },
    { id: 3, text: 'Computing trend confidence scores', status: 'running' as const, timestamp: Date.now() - 2000 },
  ] as ActivityItem[],
  report: { topic: 'AI workflow', searchInterestPct: 142, searchVolume: 78, competition: 45, emergingTopics: ['#LLMOps', '#AgentWorkflow', '#CreatorAutomation', '#SearchQuality'], geography: [{ country: 'United States', pct: 42 }, { country: 'United Kingdom', pct: 18 }, { country: 'Germany', pct: 12 }], activeHours: [20, 30, 40, 60, 80, 100, 90, 70, 50, 40, 30, 20] } as AiReport,
  canvasItems: [
    { id: 1, text: 'Hook idea: open with messy desk transformation', kind: 'sticky', color: 'bg-yellow-200 text-yellow-900', x: 160, y: 120, r: -3 },
    { id: 2, text: 'Thumbnail concept: before / after split frame', kind: 'sticky', color: 'bg-green-200 text-green-900', x: 460, y: 90, r: 2 },
    { id: 3, text: 'Sponsor integration near 3:00 mark', kind: 'sticky', color: 'bg-blue-200 text-blue-900', x: 320, y: 320, r: -2 },
  ] as CanvasItem[],
  canvasConnections: [{ id: 1, fromId: 1, toId: 2 }, { id: 2, fromId: 2, toId: 3 }] as CanvasConnection[],
  ruleBook: {
    goal: 'brand', personaAge: '25-35, Eco-conscious Tech Enthusiasts', personaMotivation: 'Finding sustainable alternatives to daily electronics',
    toggles: { trending: true, sfw: false, factcheck: true, longform: false },
    constraints: [
      { id: 1, type: 'must_include', title: 'Always mention sustainability', desc: 'Ensure every script includes a brief note on eco-friendly practices.' },
      { id: 2, type: 'must_avoid', title: 'Avoid controversial topics', desc: 'Keep research focused on technology, avoid politics.' },
      { id: 3, type: 'prefer', title: 'Prioritize local manufacturers', desc: 'Highlight US-based companies where relevant.' },
    ],
    updatedAt: Date.now(),
  } as RuleBookState,
  refreshIntervalMinutes: 1 as 1 | 2,
  lastRefreshedAt: Date.now(),
};

const hydrate = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState;
  try { return { ...initialState, ...JSON.parse(raw) }; } catch { return initialState; }
};

const persist = (state: DataState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    projects: state.projects, competitors: state.competitors, trends: state.trends, snapshots: state.snapshots, activities: state.activities,
    report: state.report, canvasItems: state.canvasItems, canvasConnections: state.canvasConnections, ruleBook: state.ruleBook,
    refreshIntervalMinutes: state.refreshIntervalMinutes, lastRefreshedAt: state.lastRefreshedAt,
  }));
};

export const useDataStore = create<DataState>((set) => ({
  ...hydrate(),
  runAnalysis: async (query) => {
    const clean = query.trim() || 'Untitled topic';
    const auth = useAuthStore.getState();

    set((state) => {
      const next = {
        ...state,
        activities: [{ id: Date.now(), text: `Running AI analysis via ${auth.provider}/${auth.model}`, status: 'running' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8),
      };
      persist(next as DataState);
      return next;
    });

    try {
      const report = await analyzeTopicWithProvider(clean, {
        provider: auth.provider,
        model: auth.model,
        apiKey: auth.apiKey,
      });

      set((state) => {
        const next = {
          ...state,
          report,
          activities: [
            { id: Date.now(), text: `Analyzed "${clean}" via ${auth.provider}:${auth.model}`, status: 'done' as const, timestamp: Date.now() },
            ...state.activities.filter((a) => a.status !== 'running'),
          ].slice(0, 8),
        };
        persist(next as DataState);
        return next;
      });
    } catch (error) {
      set((state) => {
        const next = {
          ...state,
          activities: [
            { id: Date.now(), text: `AI call failed (${String(error)}). Check API key/provider/model.`, status: 'queued' as const, timestamp: Date.now() },
            ...state.activities.filter((a) => a.status !== 'running'),
          ].slice(0, 8),
        };
        persist(next as DataState);
        return next;
      });
    }
  },
  addCompetitor: (name) => set((state) => {
    const clean = name.trim(); if (!clean) return state;
    const next = { ...state, competitors: [{ id: Date.now(), name: clean, subscribers: 20_000 + Math.floor(Math.random() * 200_000), growthPct: parseFloat((Math.random() * 18 - 3).toFixed(1)), frequencyPerWeek: 1 + Math.floor(Math.random() * 5), keywords: ['#ContentOps', '#Shorts', '#YouTubeGrowth'] }, ...state.competitors] };
    persist(next as DataState); return next;
  }),
  addProject: (title) => set((state) => {
    const clean = title.trim(); if (!clean) return state;
    const next = { ...state, projects: [{ id: Date.now(), title: clean, status: 'Research' as const, targetDate: plusDays(7), priority: 'Medium' as const, aiState: 'AI-Drafted' as const }, ...state.projects] };
    persist(next as DataState); return next;
  }),
  setRefreshIntervalMinutes: (minutes) => set((state) => { const next = { ...state, refreshIntervalMinutes: minutes }; persist(next as DataState); return next; }),
  autoRefresh: () => set((state) => {
    const last = state.snapshots[state.snapshots.length - 1];
    const next = { ...state, snapshots: [...state.snapshots.slice(-59), { date: `Day ${state.snapshots.length + 1}`, views: Math.max(1000, last.views + Math.floor((Math.random() - 0.3) * 6000)), subs: Math.max(0, last.subs + Math.floor((Math.random() - 0.35) * 20)), revenue: Math.max(20, last.revenue + Math.floor((Math.random() - 0.3) * 40)) }], lastRefreshedAt: Date.now(), activities: [{ id: Date.now(), text: 'Automated refresh pulled latest cached channel metrics', status: 'done' as const, timestamp: Date.now() }, ...state.activities].slice(0, 8) };
    persist(next as DataState); return next;
  }),
  addCanvasItem: (item) => {
    const id = Date.now();
    set((state) => { const next = { ...state, canvasItems: [...state.canvasItems, { ...item, id }] }; persist(next as DataState); return next; });
    return id;
  },
  updateCanvasItem: (id, patch) => set((state) => { const next = { ...state, canvasItems: state.canvasItems.map((i) => (i.id === id ? { ...i, ...patch } : i)) }; persist(next as DataState); return next; }),
  removeCanvasItem: (id) => set((state) => { const next = { ...state, canvasItems: state.canvasItems.filter((i) => i.id !== id), canvasConnections: state.canvasConnections.filter((c) => c.fromId !== id && c.toId !== id) }; persist(next as DataState); return next; }),
  addCanvasConnection: (fromId, toId) => set((state) => {
    if (fromId === toId) return state;
    if (state.canvasConnections.some((c) => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId))) return state;
    const next = { ...state, canvasConnections: [...state.canvasConnections, { id: Date.now(), fromId, toId }] };
    persist(next as DataState); return next;
  }),
  addTopicToCanvas: () => set((state) => { const next = { ...state, canvasItems: [...state.canvasItems, { id: Date.now(), text: `AI topic: ${state.report.topic}\nInterest +${state.report.searchInterestPct}%`, kind: 'sticky' as const, color: 'bg-purple-200 text-purple-900', x: 600, y: 180, r: -1 }] }; persist(next as DataState); return next; }),
  updateRuleBook: (patch) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, ...patch, updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  addConstraint: (constraint) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: [...state.ruleBook.constraints, { ...constraint, id: Date.now() }], updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  updateConstraint: (id, patch) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: state.ruleBook.constraints.map((c) => (c.id === id ? { ...c, ...patch } : c)), updatedAt: Date.now() } }; persist(next as DataState); return next; }),
  removeConstraint: (id) => set((state) => { const next = { ...state, ruleBook: { ...state.ruleBook, constraints: state.ruleBook.constraints.filter((c) => c.id !== id), updatedAt: Date.now() } }; persist(next as DataState); return next; }),
}));
