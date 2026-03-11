import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Brush, 
  CalendarDays, 
  Gavel, 
  LineChart, 
  Settings,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/' },
  { icon: Search, label: 'Research & Competitors', path: '/research' },
  { icon: Brush, label: 'Ideation Canvas', path: '/canvas' },
  { icon: CalendarDays, label: 'Content Planner', path: '/planner' },
  { icon: Gavel, label: 'AI Rule Book', path: '/rulebook' },
  { icon: LineChart, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { theme } = useThemeStore();
  
  return (
    <aside className="w-20 xl:w-64 h-screen bg-bg-surface border-r border-border flex flex-col transition-all duration-300 z-20">
      <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <span className="hidden xl:block ml-3 font-black text-xl text-text-1 tracking-tight">
          CreatorPulse
        </span>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary-muted text-primary" 
                : "text-text-2 hover:bg-bg-elevated hover:text-text-1"
            )}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden xl:block font-medium text-sm whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center xl:justify-start gap-2 bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span className="hidden xl:block font-bold text-sm">New Project</span>
        </button>
      </div>
    </aside>
  );
}
