import { Search, Sun, Moon, Bell, User } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.auth.me();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
          <input 
            type="text" 
            placeholder="Search across everything..." 
            className="w-full bg-bg-elevated border border-border text-text-1 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-text-2 hover:text-text-1 hover:bg-bg-elevated rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'nightfall' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="p-2 text-text-2 hover:text-text-1 hover:bg-bg-elevated rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-bg-surface"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary-muted border border-primary flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors font-bold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
      </div>
    </header>
  );
}
