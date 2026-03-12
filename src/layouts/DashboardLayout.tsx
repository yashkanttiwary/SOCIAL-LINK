import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AIPanel } from '../components/AIPanel';
import { Sparkles } from 'lucide-react';
import { useAIPanelStore } from '../store/aiPanelStore';
import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';

export function DashboardLayout() {
  const { openPanel } = useAIPanelStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.className = theme === 'clarity' ? 'theme-clarity' : '';
  }, [theme]);

  return (
    <div className="flex h-screen bg-bg-base text-text-1 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-0">
          <Outlet />
        </main>
        
        <button 
          onClick={openPanel}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-30"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
      <AIPanel />
    </div>
  );
}
