import { useMemo, useState } from 'react';
import { Search, Zap, ExternalLink, Plus, TrendingUp, BarChart3, MapPin, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';
import { useDataStore } from '../store/dataStore';

export function Research() {
  const { openPanel } = useAIPanelStore();
  const { competitors, trends, report, runAnalysis, addCompetitor } = useDataStore();
  const [query, setQuery] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sortedTrends = useMemo(
    () => [...trends].sort((a, b) => b.growthPct - a.growthPct),
    [trends],
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await runAnalysis(query);
    openPanel();
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-4xl font-black text-text-1 mb-3">Research & Analysis</h1>
        <p className="text-text-2 mb-8 max-w-xl mx-auto">Fully data-driven analysis. Query a URL, keyword, or topic and AI updates your datasets.</p>

        <div className="max-w-2xl mx-auto relative flex items-center">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3"><Search className="w-6 h-6" /></div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Paste a YouTube URL, keyword, or topic..."
            className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-32 py-4 text-lg focus:outline-none focus:border-primary transition-colors shadow-sm"
          />
          <button onClick={handleAnalyze} className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
            {isAnalyzing ? 'Analyzing...' : 'Analyze'} <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-text-1">Competitor Performance</h2>
          <div className="flex items-center gap-2">
            <input
              value={newCompetitor}
              onChange={(e) => setNewCompetitor(e.target.value)}
              placeholder="Competitor channel"
              className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                addCompetitor(newCompetitor);
                setNewCompetitor('');
              }}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 bg-primary-muted px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Competitor
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitors.map((c) => (
            <div key={c.id} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary transition-colors group relative">
              <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-text-3 opacity-0 group-hover:opacity-100" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-muted flex items-center justify-center text-primary font-bold text-xl">{c.name.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-text-1 text-lg">{c.name}</h3>
                  <p className="text-sm text-text-3">{(c.subscribers / 1000).toFixed(1)}K subscribers</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-elevated p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-3 uppercase font-bold mb-1">Growth</p>
                  <p className={cn('font-black text-lg', c.growthPct >= 0 ? 'text-success' : 'text-danger')}>{c.growthPct >= 0 ? '+' : ''}{c.growthPct}%</p>
                </div>
                <div className="bg-bg-elevated p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-3 uppercase font-bold mb-1">Uploads</p>
                  <p className="font-black text-lg text-text-1">{c.frequencyPerWeek}/week</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">{c.keywords.map((k) => <span key={k} className="text-xs font-medium bg-primary-muted text-primary px-2 py-1 rounded-full">{k}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text-1 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Audience Insights</h2>
          <h3 className="text-sm font-bold text-text-2 mb-4 uppercase tracking-wider">Top Geographies</h3>
          <div className="space-y-4 mb-6">
            {report.geography.map((g) => (
              <div key={g.country}>
                <div className="flex justify-between text-sm font-medium mb-1"><span>{g.country}</span><span>{g.pct}%</span></div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${g.pct}%` }} /></div>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-bold text-text-2 mb-4 uppercase tracking-wider">Peak Active Hours</h3>
          <div className="flex items-end gap-1 h-24">{report.activeHours.map((h, i) => <div key={i} className="flex-1 bg-primary-muted rounded-t-sm" style={{ height: `${h}%` }} />)}</div>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-text-1 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Trend Discovery</h2>
          <div className="space-y-4 flex-1">
            {sortedTrends.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-elevated/50">
                <div className="flex items-center gap-4"><Activity className="w-5 h-5 text-primary" /><div><h4 className="font-bold">{t.name}</h4><p className="text-xs text-text-3">{t.category}</p></div></div>
                <span className="text-sm font-bold text-success">+{t.growthPct}%</span>
              </div>
            ))}
          </div>
          <button onClick={handleAnalyze} className="w-full mt-6 py-3 border border-border rounded-xl font-bold text-text-2 hover:bg-bg-elevated transition-colors">Refresh AI Trend Scan</button>
        </div>
      </div>

      <div className="text-xs text-text-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Last AI topic analyzed: <span className="font-bold text-text-2">{report.topic}</span></div>
    </div>
  );
}
