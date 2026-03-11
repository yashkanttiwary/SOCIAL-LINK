import { create } from 'zustand';
import { type AIProviderId, getProviderById } from '../lib/aiProviders';

interface AuthState {
  provider: AIProviderId;
  model: string;
  apiKey: string;
  youtubeApiKey: string;
  channelInput: string;
  isConfigured: boolean;
  setProvider: (provider: AIProviderId) => void;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
  setYoutubeApiKey: (key: string) => void;
  setChannelInput: (value: string) => void;
  saveConfig: () => void;
  logout: () => void;
}

const KEY = 'social-link-auth-v2';

const hydrate = () => {
  const provider = 'gemini' as AIProviderId;
  const model = getProviderById(provider).models[0].value;
  const fallback = { provider, model, apiKey: '', youtubeApiKey: '', channelInput: '', isConfigured: false };
  const raw = localStorage.getItem(KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      provider: (parsed.provider as AIProviderId) || provider,
      model: parsed.model || model,
      apiKey: parsed.apiKey || '',
      youtubeApiKey: parsed.youtubeApiKey || '',
      channelInput: parsed.channelInput || '',
      isConfigured: Boolean(parsed.apiKey),
    };
  } catch {
    return fallback;
  }
};

const persist = (state: Pick<AuthState, 'provider' | 'model' | 'apiKey' | 'youtubeApiKey' | 'channelInput'>) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const useAuthStore = create<AuthState>((set) => ({
  ...hydrate(),
  setProvider: (provider) => {
    const model = getProviderById(provider).models[0].value;
    set((state) => { const next = { ...state, provider, model }; persist(next); return next; });
  },
  setModel: (model) => set((state) => { const next = { ...state, model }; persist(next); return next; }),
  setApiKey: (apiKey) => set((state) => ({ ...state, apiKey })),
  setYoutubeApiKey: (youtubeApiKey) => set((state) => { const next = { ...state, youtubeApiKey }; persist(next); return next; }),
  setChannelInput: (channelInput) => set((state) => { const next = { ...state, channelInput }; persist(next); return next; }),
  saveConfig: () => set((state) => { const next = { ...state, isConfigured: Boolean(state.apiKey.trim()) }; persist(next); return next; }),
  logout: () => {
    localStorage.removeItem(KEY);
    const provider = 'gemini' as AIProviderId;
    const model = getProviderById(provider).models[0].value;
    set({ provider, model, apiKey: '', youtubeApiKey: '', channelInput: '', isConfigured: false });
  },
}));
