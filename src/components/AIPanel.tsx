import { useMemo } from 'react';
import { X, Sparkles, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { useAIPanelStore } from '../store/aiPanelStore';
import { cn } from '../lib/utils';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

export function AIPanel() {
  const { isOpen, closePanel } = useAIPanelStore();
  const { activities, report, addProject, addTopicToCanvas } = useDataStore();
  const { provider, model } = useAuthStore();

  const activityRows = useMemo(() => activities.slice(0, 4), [activities]);

  return (
    <>
      <div className={cn('fixed top-0 right-0 h-screen w-96 bg-bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-bg-elevated">
          <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary" /><h2 className="font-bold text-text-1">AI Research Assistant</h2></div>
          <button onClick={closePanel} className="text-text-2 hover:text-text-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider mb-4">Live Activity</h3>
            <div className="space-y-3">
              {activityRows.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  {a.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-success mt-0.5" /> : a.status === 'running' ? <Loader2 className="w-4 h-4 text-primary mt-0.5 animate-spin" /> : <Circle className="w-4 h-4 text-text-3 mt-0.5" />}
                  <div><p className="text-sm">{a.text}</p><p className="text-xs text-text-3">{Math.max(1, Math.floor((Date.now() - a.timestamp) / 1000))}s ago</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">Results</h3>
            <p className="text-[11px] text-text-3">Provider: {provider} • Model: {model}</p>
            <div className="bg-bg-elevated border border-border rounded-xl p-4">
              <h4 className="font-bold text-sm">{report.topic}</h4>
              <p className="text-xs text-success font-medium">Search interest +{report.searchInterestPct}%</p>
            </div>
            <div className="bg-bg-elevated border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs">Search Volume: <span className="font-bold">{report.searchVolume}/100</span></p>
              <p className="text-xs">Competition: <span className="font-bold">{report.competition}/100</span></p>
              <div className="flex flex-wrap gap-2">{report.emergingTopics.map((tag) => <span key={tag} className="text-xs bg-primary-muted text-primary px-2 py-1 rounded-full">{tag}</span>)}</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-bg-elevated space-y-3">
          <button onClick={() => addTopicToCanvas()} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg">Add to Canvas</button>
          <button onClick={() => addProject(`AI topic: ${report.topic}`)} className="w-full bg-transparent border border-primary text-primary font-bold py-2.5 rounded-lg">Add to Planner</button>
          <button onClick={() => navigator.clipboard.writeText(JSON.stringify(report, null, 2))} className="w-full bg-transparent border border-border text-text-1 font-bold py-2.5 rounded-lg">Copy Report</button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={closePanel} />}
    </>
  );
}
