import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Sparkles, CheckCircle2, Loader2, Circle, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useAIPanelStore } from '../store/aiPanelStore';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';

export function AIPanel() {
  const { isOpen, closePanel } = useAIPanelStore();
  const location = useLocation();
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && insights.length === 0) {
      fetchInsights();
    }
  }, [isOpen]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      let context = "Current YouTube trends in technology and gaming";
      if (location.pathname.includes('canvas')) {
        context = "Brainstorming and ideation for YouTube videos";
      } else if (location.pathname.includes('planner')) {
        context = "Content planning and scheduling strategies for YouTube";
      } else if (location.pathname.includes('research')) {
        context = "Competitor analysis and trend spotting on YouTube";
      } else if (location.pathname.includes('rulebook')) {
        context = "Setting constraints and goals for a YouTube channel";
      } else if (location.pathname.includes('analytics')) {
        context = "Analyzing YouTube metrics and performance data";
      }

      const res = await api.ai.insights(context);
      setInsights(res.insights);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlanner = async (insight: string) => {
    try {
      await api.planner.create({
        title: insight.substring(0, 50) + (insight.length > 50 ? '...' : ''),
        status: 'idea',
        priority: 'medium',
        targetDate: new Date().toISOString()
      });
      alert('Added to planner!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to planner');
    }
  };

  const handleAddToCanvas = async (insight: string) => {
    try {
      const currentCanvas = await api.canvas.get();
      const newNote = {
        id: uuidv4(),
        text: insight,
        color: 'bg-primary-muted',
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50
      };
      await api.canvas.save({
        theme: currentCanvas.theme || '',
        notes: [...(currentCanvas.notes || []), newNote]
      });
      alert('Added to canvas!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to canvas');
    }
  };

  return (
    <>
      <div 
        className={cn(
          "fixed top-0 right-0 h-screen w-96 bg-bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-bg-elevated">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-text-1">AI Research Assistant</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              Online
            </span>
            <button onClick={closePanel} className="text-text-2 hover:text-text-1 hover:bg-bg-base p-1.5 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">Live Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-text-1">Scanned Google Trends for 'AI Workflow'</p>
                  <p className="text-xs text-text-3 mt-0.5">2s ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-text-1">Analyzed 3 competitor channels</p>
                  <p className="text-xs text-text-3 mt-0.5">5s ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Loader2 className="w-4 h-4 text-primary mt-0.5 shrink-0 animate-spin" />
                <div>
                  <p className="text-sm text-text-1">Checking YouTube keyword difficulty...</p>
                  <p className="text-xs text-text-3 mt-0.5">in progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <Circle className="w-4 h-4 text-text-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-text-1">Generating content suggestions</p>
                  <p className="text-xs text-text-3 mt-0.5">queued</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">AI Insights</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-text-3">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p className="text-sm">Analyzing data and generating insights...</p>
              </div>
            ) : error ? (
              <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-danger text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="bg-bg-elevated border border-border rounded-xl p-4 text-sm text-text-1 leading-relaxed group relative">
                    {insight}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-bg-elevated/90 backdrop-blur-sm p-1 rounded-lg">
                      <button 
                        onClick={() => handleAddToCanvas(insight)}
                        className="p-1.5 text-text-3 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Add to Canvas"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAddToPlanner(insight)}
                        className="p-1.5 text-text-3 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Add to Planner"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-3 text-sm">
                No insights available.
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-bg-elevated space-y-3">
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Refresh Insights
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closePanel}
        />
      )}
    </>
  );
}
