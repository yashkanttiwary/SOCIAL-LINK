import { useState, useEffect, FormEvent } from 'react';
import { Search, Zap, ExternalLink, Plus, TrendingUp, BarChart3, MapPin, Activity, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';
import { api } from '../lib/api';

const iconMap: Record<string, any> = {
  Activity,
  TrendingUp,
  BarChart3
};

export function Research() {
  const { openPanel } = useAIPanelStore();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', subs: '', growth: '', freq: '', keywords: '' });
  const [savingCompetitor, setSavingCompetitor] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [compData, trendData] = await Promise.all([
          api.research.competitors(),
          api.research.trends()
        ]);
        setCompetitors(compData.competitors);
        setTrends(trendData.trends);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddCompetitor = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name) return;
    
    setSavingCompetitor(true);
    try {
      const keywordsArray = newCompetitor.keywords.split(',').map(k => k.trim()).filter(k => k);
      const res = await api.research.addCompetitor({
        ...newCompetitor,
        keywords: keywordsArray
      });
      setCompetitors([...competitors, res.competitor]);
      setIsAddingCompetitor(false);
      setNewCompetitor({ name: '', subs: '', growth: '', freq: '', keywords: '' });
    } catch (err) {
      console.error('Failed to add competitor', err);
    } finally {
      setSavingCompetitor(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-4xl font-black text-text-1 mb-3">Research & Analysis</h1>
        <p className="text-text-2 mb-8 max-w-xl mx-auto">Paste a YouTube URL, keyword, or topic to get AI-powered insights.</p>
        
        <div className="max-w-2xl mx-auto relative flex items-center">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            placeholder="Paste a YouTube URL, keyword, or topic..." 
            className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-32 py-4 text-lg focus:outline-none focus:border-primary transition-colors shadow-sm text-text-1"
          />
          <button 
            onClick={openPanel}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            Analyze <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Competitors Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-1">Competitor Performance</h2>
          <button 
            onClick={() => setIsAddingCompetitor(true)}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 bg-primary-muted px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Competitor
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitors.map((c, i) => (
            <div key={i} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary transition-colors group relative">
              <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-text-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-muted flex items-center justify-center text-primary font-bold text-xl">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-text-1 text-lg">{c.name}</h3>
                  <p className="text-sm text-text-3">{c.subs} subscribers</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-elevated p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-3 uppercase font-bold mb-1">Growth</p>
                  <p className={cn("font-black text-lg", c.growth.startsWith('+') ? "text-success" : "text-danger")}>{c.growth}</p>
                </div>
                <div className="bg-bg-elevated p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-3 uppercase font-bold mb-1">Uploads</p>
                  <p className="font-black text-lg text-text-1">{c.freq}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-text-3 uppercase font-bold mb-2">Top Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {c.keywords.map((k: string) => (
                    <span key={k} className="text-xs font-medium bg-primary-muted text-primary px-2 py-1 rounded-full">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Insights */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text-1 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Audience Insights
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-text-2 mb-4 uppercase tracking-wider">Top Geographies</h3>
              <div className="space-y-4">
                {[
                  { country: 'United States', pct: 42 },
                  { country: 'United Kingdom', pct: 18 },
                  { country: 'Germany', pct: 12 },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-text-1">{g.country}</span>
                      <span className="text-text-2">{g.pct}%</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${g.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-bold text-text-2 mb-4 uppercase tracking-wider">Peak Active Hours</h3>
              <div className="flex items-end gap-1 h-24">
                {[20, 30, 40, 60, 80, 100, 90, 70, 50, 40, 30, 20].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary-muted group-hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-3 mt-2 font-medium">
                <span>6AM</span>
                <span>12PM</span>
                <span>6PM</span>
                <span>12AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Discovery */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-text-1 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Trend Discovery
          </h2>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['All Trends', 'Technology', 'Gaming', 'Finance'].map((f, i) => (
              <button key={i} className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                i === 1 ? "bg-primary text-white" : "bg-bg-elevated text-text-2 hover:text-text-1"
              )}>
                {f}
              </button>
            ))}
          </div>
          
          <div className="space-y-4 flex-1">
            {trends.map((t, i) => {
              const Icon = iconMap[t.icon] || Activity;
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary transition-colors bg-bg-elevated/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-1">{t.name}</h4>
                      <p className="text-xs text-text-3">{t.subtitle}</p>
                    </div>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap", t.badgeColor)}>
                    {t.badge}
                  </span>
                </div>
              );
            })}
          </div>
          
          <button className="w-full mt-6 py-3 border border-border rounded-xl font-bold text-text-2 hover:text-text-1 hover:bg-bg-elevated transition-colors">
            Explore All Trends
          </button>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {isAddingCompetitor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-1">Add Competitor</h2>
              <button onClick={() => setIsAddingCompetitor(false)} className="text-text-3 hover:text-text-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-2 mb-1">Channel Name *</label>
                <input 
                  type="text" 
                  required
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-text-1"
                  placeholder="e.g. TechReview Pro"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-2 mb-1">Subscribers</label>
                  <input 
                    type="text" 
                    value={newCompetitor.subs}
                    onChange={(e) => setNewCompetitor({...newCompetitor, subs: e.target.value})}
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-text-1"
                    placeholder="e.g. 1.2M"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-2 mb-1">Growth</label>
                  <input 
                    type="text" 
                    value={newCompetitor.growth}
                    onChange={(e) => setNewCompetitor({...newCompetitor, growth: e.target.value})}
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-text-1"
                    placeholder="e.g. +12.4%"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-2 mb-1">Upload Frequency</label>
                <input 
                  type="text" 
                  value={newCompetitor.freq}
                  onChange={(e) => setNewCompetitor({...newCompetitor, freq: e.target.value})}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-text-1"
                  placeholder="e.g. 3/week"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-2 mb-1">Top Keywords (comma separated)</label>
                <input 
                  type="text" 
                  value={newCompetitor.keywords}
                  onChange={(e) => setNewCompetitor({...newCompetitor, keywords: e.target.value})}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-text-1"
                  placeholder="e.g. #Tech, #Review"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingCompetitor(false)}
                  className="px-4 py-2 rounded-lg font-bold text-text-2 hover:bg-bg-elevated transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingCompetitor || !newCompetitor.name}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {savingCompetitor ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
