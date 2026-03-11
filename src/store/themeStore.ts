import { create } from 'zustand';

type Theme = 'nightfall' | 'clarity';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'nightfall',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'nightfall' ? 'clarity' : 'nightfall' })),
  setTheme: (theme) => set({ theme }),
}));
