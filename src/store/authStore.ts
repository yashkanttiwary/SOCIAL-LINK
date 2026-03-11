import { create } from 'zustand';
import { type AIProviderId, getProviderById } from '../lib/aiProviders';

interface AuthState {
  provider: AIProviderId;
  model: string;
  apiKey: string;
  isConfigured: boolean;
  setProvider: (provider: AIProviderId) => void;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
  saveConfig: () => void;
  logout: () => void;
}

const KEY = 'social-link-auth-v1';

const hydrate = () => {
  const provider = 'gemini' as AIProviderId;
  const model = getProviderById(provider).models[0].value;
  const fallback = { provider, model, apiKey: '', isConfigured: false };
  const raw = localStorage.getItem(KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      provider: (parsed.provider as AIProviderId) || provider,
      model: parsed.model || model,
      apiKey: parsed.apiKey || '',
      isConfigured: Boolean(parsed.apiKey),
    };
  } catch {
    return fallback;
  }
};

const persist = (state: Pick<AuthState, 'provider' | 'model' | 'apiKey'>) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...hydrate(),
  setProvider: (provider) => {
    const model = getProviderById(provider).models[0].value;
    set((state) => {
      const next = { ...state, provider, model };
      persist(next);
      return next;
    });
  },
  setModel: (model) => set((state) => {
    const next = { ...state, model };
    persist(next);
    return next;
  }),
  setApiKey: (apiKey) => set((state) => ({ ...state, apiKey })),
  saveConfig: () => set((state) => {
    const next = { ...state, isConfigured: Boolean(state.apiKey.trim()) };
    persist(next);
    return next;
  }),
  logout: () => {
    localStorage.removeItem(KEY);
    const provider = 'gemini' as AIProviderId;
    const model = getProviderById(provider).models[0].value;
    set({ provider, model, apiKey: '', isConfigured: false });
  },
}));
