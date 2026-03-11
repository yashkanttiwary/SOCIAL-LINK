import { TrendingUp, TrendingDown, Edit3, Eye, Calendar, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';

const activeRules = [
  { icon: ShieldCheck, title: 'Fact-Check Sources', desc: 'Ensure all claims have citations' },
  { icon: TrendingUp, title: 'Prioritize Trending', desc: 'Focus on breakout keywords' },
  { icon: Eye, title: 'Safe for Work', desc: 'Avoid controversial topics' },
];

export function CommandCenter() {
  const { channelName, snapshots, competitors, projects, report, lastRefreshedAt, refreshIntervalMinutes } = useDataStore();
  const hasData = snapshots.length > 0;
  const latest = hasData ? snapshots[snapshots.length - 1] : { views: 0, subs: 0, revenue: 0 };
  const prev = snapshots.length > 1 ? snapshots[snapshots.length - 2] : latest;
  const changePct = (a: number, b: number) => (b <= 0 ? '—' : `${(((a - b) / b) * 100).toFixed(1)}%`);

  const metrics = [
    { label: 'Total Views', value: hasData ? latest.views.toLocaleString() : '—', trend: hasData ? changePct(latest.views, prev.views) : 'Connect channel', isPositive: latest.views >= prev.views },
    { label: 'Subscribers', value: hasData ? latest.subs.toLocaleString() : '—', trend: hasData ? changePct(latest.subs, prev.subs) : 'Connect channel', isPositive: latest.subs >= prev.subs },
    { label: 'Search Volume', value: report.searchVolume ? `${report.searchVolume}/100` : '—', trend: report.searchInterestPct ? `${report.searchInterestPct}%` : 'Run analysis', isPositive: true },
    { label: 'Est. Revenue', value: hasData ? `$${latest.revenue.toLocaleString()}` : '—', trend: hasData ? changePct(latest.revenue, prev.revenue) : 'Requires monetization data', isPositive: latest.revenue >= prev.revenue },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-text-1 tracking-tight">Command Center</h1>
      <p className="text-sm text-text-3">
        {channelName ? `Connected channel: ${channelName}. ` : 'No channel synced yet. Go to Settings and run “Sync Channel Data”. '}
        Refresh every {refreshIntervalMinutes} minute(s). {lastRefreshedAt ? `Last sync: ${new Date(lastRefreshedAt).toLocaleTimeString()}.` : ''}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-text-3 uppercase tracking-wider">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="text-3xl font-black text-text-1">{m.value}</h2>
              <span className={cn('flex items-center text-sm font-bold', m.isPositive ? 'text-success' : 'text-danger')}>
                {m.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[350px]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg-elevated"><h3 className="font-bold flex items-center gap-2"><Edit3 className="w-5 h-5 text-primary" /> Ideation Canvas</h3><Link to="/canvas" className="text-sm font-bold text-primary">Open Canvas →</Link></div>
            <div className="p-4 text-sm text-text-2">Latest AI topic: <span className="font-bold text-text-1">{report.topic || 'No analysis yet'}</span><div className="mt-3 flex flex-wrap gap-2">{report.emergingTopics.map((t) => <span key={t} className="text-xs bg-primary-muted text-primary px-2 py-1 rounded-full">{t}</span>)}</div></div>
          </div>

          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-text-1 text-lg">Competitor Insights</h3><Link to="/research" className="text-sm font-bold text-primary">View All →</Link></div>
            {competitors.length === 0 ? <p className="text-sm text-text-3">No competitor data yet. Add competitors in Research.</p> : <table className="w-full text-left border-collapse"><thead><tr className="border-b border-border text-xs uppercase tracking-wider text-text-3"><th className="pb-3">Competitor</th><th className="pb-3">Subscribers</th><th className="pb-3">Growth</th></tr></thead><tbody>
              {competitors.slice(0, 4).map((c) => <tr key={c.id} className="border-b border-border"><td className="py-3 font-bold">{c.name}</td><td>{(c.subscribers / 1000).toFixed(1)}K</td><td className={c.growthPct >= 0 ? 'text-success' : 'text-danger'}>{c.growthPct}%</td></tr>)}
            </tbody></table>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Up Next</h3><Link to="/planner" className="text-sm font-bold text-primary">Full Schedule →</Link></div>
            <div className="space-y-3">{projects.length === 0 ? <p className="text-sm text-text-3">No synced videos yet.</p> : projects.slice(0, 4).map((p) => <div key={p.id} className="border border-border rounded-lg p-3"><p className="font-bold text-sm">{p.title}</p><p className="text-xs text-text-3 mt-1">{p.targetDate} • {p.status}</p></div>)}</div>
          </div>
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6"><h3 className="font-bold text-text-1 text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Active Rules</h3><div className="space-y-4">{activeRules.map((r) => <div key={r.title}><p className="font-bold text-sm">{r.title}</p><p className="text-xs text-text-3">{r.desc}</p></div>)}</div></div>
        </div>
      </div>
    </div>
  );
}
