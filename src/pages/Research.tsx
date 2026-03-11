import { Search, Zap, ExternalLink, Plus, TrendingUp, BarChart3, MapPin, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';

const competitors = [
  { name: 'TechReview Pro', subs: '1.2M', growth: '+12.4%', freq: '3/week', keywords: ['#iPhone15', '#Gadgets', '#Setup'] },
  { name: 'Future Logic', subs: '840K', growth: '+8.2%', freq: '1/week', keywords: ['#AI', '#MachineLearning', '#FutureTech'] },
  { name: 'Code With Sam', subs: '2.5M', growth: '-2.1%', freq: 'Daily', keywords: ['#Python', '#ReactJS', '#Tailwind'] },
];

const trends = [
  { icon: Activity, name: 'Vision Pro Long-term Reviews', subtitle: 'Hardware', badge: 'Breakout', badgeColor: 'bg-primary text-white' },
  { icon: TrendingUp, name: 'Low-code AI App Dev', subtitle: 'Software', badge: '+120%', badgeColor: 'bg-success/10 text-success' },
  { icon: BarChart3, name: 'Custom Keyboard Builds', subtitle: 'Accessories', badge: 'Steady', badgeColor: 'bg-bg-elevated text-text-2' },
];

export function Research() {
  const { openPanel } = useAIPanelStore();

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
            className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-32 py-4 text-lg focus:outline-none focus:border-primary transition-colors shadow-sm"
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
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 bg-primary-muted px-4 py-2 rounded-lg transition-colors">
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
                  {c.keywords.map(k => (
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
            {trends.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary transition-colors bg-bg-elevated/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center shrink-0">
                    <t.icon className="w-5 h-5 text-primary" />
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
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-border rounded-xl font-bold text-text-2 hover:text-text-1 hover:bg-bg-elevated transition-colors">
            Explore All Trends
          </button>
        </div>
      </div>
    </div>
  );
}
