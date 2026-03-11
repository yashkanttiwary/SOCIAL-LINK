import { X, Sparkles, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { useAIPanelStore } from '../store/aiPanelStore';
import { cn } from '../lib/utils';

export function AIPanel() {
  const { isOpen, closePanel } = useAIPanelStore();

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
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">Results</h3>
            
            <div className="bg-bg-elevated border border-border rounded-xl p-4">
              <h4 className="font-bold text-sm text-text-1 mb-1">Generative AI Tools</h4>
              <p className="text-xs text-success font-medium flex items-center gap-1">Search interest +142%</p>
              <div className="mt-3 h-12 flex items-end gap-1">
                {[20, 30, 45, 60, 80, 100, 142].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${(h/142)*100}%` }}></div>
                ))}
              </div>
            </div>

            <div className="bg-bg-elevated border border-border rounded-xl p-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-2">Search Volume</span>
                  <span className="text-success font-bold">High (78)</span>
                </div>
                <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[78%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-2">Competition</span>
                  <span className="text-warning font-bold">Med (45)</span>
                </div>
                <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-warning w-[45%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-bg-elevated border border-border rounded-xl p-4">
              <h4 className="font-bold text-sm text-text-1 mb-2">Emerging Topics</h4>
              <div className="flex flex-wrap gap-2">
                {['#Web3Design', '#NoCode', '#CarbonSync', '#SpatialComputing'].map(tag => (
                  <span key={tag} className="text-xs bg-primary-muted text-primary px-2 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-bg-elevated space-y-3">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm">
            Add to Canvas
          </button>
          <button className="w-full bg-transparent border border-primary text-primary hover:bg-primary-muted font-bold py-2.5 rounded-lg transition-colors">
            Add to Planner
          </button>
          <button className="w-full bg-transparent text-text-2 hover:text-text-1 hover:bg-bg-base font-medium py-2 rounded-lg transition-colors text-sm">
            Copy Report
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
