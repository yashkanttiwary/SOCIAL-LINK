import { useState } from 'react';
import { Search, Users, Share2, Filter, ArrowUpDown, Calendar as CalendarIcon, LayoutList, Sparkles, Plus, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';

const projects = [
  { id: 1, title: '10 Minimalist Desk Setup Tips', status: 'Ideation', date: 'Oct 24', ai: 'AI-Drafted', priority: 'High', color: 'bg-warning', aiColor: 'bg-indigo-500 text-white', prioColor: 'text-danger' },
  { id: 2, title: 'iPhone 15 Pro Max Review', status: 'Filming', date: 'Oct 26', ai: 'AI-Optimized', priority: 'Urgent', color: 'bg-primary', aiColor: 'bg-indigo-500 text-white', prioColor: 'bg-danger text-white px-2 rounded-md' },
  { id: 3, title: 'Life of a Software Engineer', status: 'Editing', date: 'Oct 28', ai: 'Researching...', priority: 'Medium', color: 'bg-indigo-500', aiColor: 'bg-bg-elevated text-text-2 border border-border animate-pulse', prioColor: 'text-warning' },
  { id: 4, title: 'How to use LLMs efficiently', status: 'Published', date: 'Oct 20', ai: 'Completed', priority: 'Low', color: 'bg-success', aiColor: 'bg-success/10 text-success', prioColor: 'text-text-3' },
];

export function Planner() {
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const { openPanel } = useAIPanelStore();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-text-1 tracking-tight">Content Planner</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-muted border-2 border-bg-base flex items-center justify-center text-xs font-bold text-primary z-20">A</div>
            <div className="w-8 h-8 rounded-full bg-success/20 border-2 border-bg-base flex items-center justify-center text-xs font-bold text-success z-10">S</div>
            <div className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg-base flex items-center justify-center text-xs font-bold text-text-2 z-0">+2</div>
          </div>
          <button className="flex items-center gap-2 bg-bg-surface border border-border hover:bg-bg-elevated text-text-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-6 overflow-x-auto">
          {['All Videos', 'Scheduled', 'Archive', 'Ideas Pool'].map((tab, i) => (
            <button key={tab} className={cn(
              "text-sm font-bold whitespace-nowrap pb-4 -mb-4 border-b-2 transition-colors",
              i === 0 ? "border-primary text-primary" : "border-transparent text-text-2 hover:text-text-1"
            )}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-bold text-text-2 hover:text-text-1 bg-bg-surface border border-border px-3 py-1.5 rounded-lg transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-text-2 hover:text-text-1 bg-bg-surface border border-border px-3 py-1.5 rounded-lg transition-colors">
            <ArrowUpDown className="w-4 h-4" /> Sort
          </button>
          <div className="flex bg-bg-surface border border-border rounded-lg p-1">
            <button 
              onClick={() => setView('table')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'table' ? "bg-bg-elevated text-text-1 shadow-sm" : "text-text-3 hover:text-text-2")}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'calendar' ? "bg-bg-elevated text-text-1 shadow-sm" : "text-text-3 hover:text-text-2")}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {view === 'table' ? (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-bg-elevated border-b border-border text-xs uppercase tracking-wider text-text-3">
                    <th className="p-4 w-12"><input type="checkbox" className="rounded border-border" /></th>
                    <th className="p-4 font-medium">Video Title</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Target Date</th>
                    <th className="p-4 font-medium">Research AI</th>
                    <th className="p-4 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-border hover:bg-bg-elevated transition-colors group">
                      <td className="p-4"><input type="checkbox" className="rounded border-border" /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 bg-bg-elevated rounded border border-border flex items-center justify-center shrink-0">
                            <PlayCircle className="w-4 h-4 text-text-3" />
                          </div>
                          <span className="font-bold text-text-1 group-hover:text-primary transition-colors cursor-pointer">{p.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold text-white", p.color)}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-text-2">{p.date}</td>
                      <td className="p-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", p.aiColor)}>
                          {p.ai}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", p.prioColor)}>
                          {p.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="p-4">
                      <button className="flex items-center gap-2 text-sm font-bold text-text-3 hover:text-text-1 transition-colors">
                        <Plus className="w-4 h-4" /> Add new video project
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border bg-bg-elevated flex justify-between items-center text-xs font-medium text-text-3">
              <span>Showing 4 of 48 video projects</span>
              <div className="flex gap-1">
                <button className="p-1 hover:text-text-1"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:text-text-1"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-1">October 2026</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-border rounded-lg hover:bg-bg-elevated transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-2 border border-border rounded-lg hover:bg-bg-elevated transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-xl overflow-hidden flex-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-bg-elevated p-2 text-center text-xs font-bold text-text-3 uppercase tracking-wider">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3; // Offset to start Oct 1 on Thursday
                const isCurrentMonth = day > 0 && day <= 31;
                const dateStr = `Oct ${day}`;
                const dayProjects = projects.filter(p => p.date === dateStr);
                
                return (
                  <div key={i} className={cn(
                    "bg-bg-surface p-2 min-h-[100px] transition-colors hover:bg-bg-elevated/50",
                    !isCurrentMonth && "bg-bg-elevated/30 text-text-3"
                  )}>
                    <span className={cn("text-sm font-bold", isCurrentMonth ? "text-text-1" : "text-text-3/50")}>
                      {day > 0 ? (day <= 31 ? day : day - 31) : 30 + day}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dayProjects.map(p => (
                        <div key={p.id} className="text-[10px] font-bold bg-bg-elevated border border-border rounded-md p-1.5 truncate flex items-center gap-1.5 cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
                          <div className={cn("w-2 h-2 rounded-full shrink-0", p.color)}></div>
                          <span className="truncate text-text-1">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI FAB */}
      <button 
        onClick={openPanel}
        className="fixed bottom-8 right-28 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105 z-30"
      >
        <Sparkles className="w-5 h-5" /> AI Generate Schedule
      </button>
    </div>
  );
}
