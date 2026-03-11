import { useMemo, useState } from 'react';
import { Search, Plus, Calendar as CalendarIcon, LayoutList, Sparkles, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';
import { useDataStore } from '../store/dataStore';

export function Planner() {
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const { openPanel } = useAIPanelStore();
  const { projects, addProject } = useDataStore();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = projects.filter((p) => p.title.toLowerCase().includes(q));
    const prioRank = { Low: 1, Medium: 2, High: 3, Urgent: 4 };
    return list.sort((a, b) => (sortBy === 'priority'
      ? prioRank[b.priority] - prioRank[a.priority]
      : a.targetDate.localeCompare(b.targetDate)));
  }, [projects, search, sortBy]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-text-1 tracking-tight">Content Planner</h1>
        <div className="flex items-center gap-2">
          <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="New video idea" className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm" />
          <button onClick={() => { addProject(newProject); setNewProject(''); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold"><Plus className="w-4 h-4" /> Add</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')} className="text-sm font-bold bg-bg-surface border border-border px-3 py-1.5 rounded-lg">Sort: {sortBy}</button>
          <div className="flex bg-bg-surface border border-border rounded-lg p-1">
            <button onClick={() => setView('table')} className={cn('p-1.5 rounded-md', view === 'table' ? 'bg-bg-elevated text-text-1' : 'text-text-3')}><LayoutList className="w-4 h-4" /></button>
            <button onClick={() => setView('calendar')} className={cn('p-1.5 rounded-md', view === 'calendar' ? 'bg-bg-elevated text-text-1' : 'text-text-3')}><CalendarIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {view === 'table' ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead><tr className="bg-bg-elevated border-b border-border text-xs uppercase tracking-wider text-text-3"><th className="p-4">Video Title</th><th className="p-4">Status</th><th className="p-4">Target Date</th><th className="p-4">AI</th><th className="p-4">Priority</th></tr></thead>
              <tbody className="text-sm">
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-bg-elevated transition-colors group">
                    <td className="p-4"><div className="flex items-center gap-3"><PlayCircle className="w-4 h-4 text-text-3" /><span className="font-bold">{p.title}</span></div></td>
                    <td className="p-4">{p.status}</td>
                    <td className="p-4">{p.targetDate}</td>
                    <td className="p-4">{p.aiState}</td>
                    <td className="p-4 font-bold">{p.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-border bg-bg-elevated">
                <p className="font-bold text-text-1">{p.title}</p>
                <p className="text-sm text-text-2 mt-1">{p.targetDate} • {p.status} • {p.priority}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={openPanel} className="fixed bottom-8 right-28 bg-primary text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 z-30"><Sparkles className="w-5 h-5" /> AI Generate Schedule</button>
    </div>
  );
}
