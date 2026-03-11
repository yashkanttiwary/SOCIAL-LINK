import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';
import { useDataStore } from '../store/dataStore';

export function Analytics() {
  const { theme } = useThemeStore();
  const { snapshots, projects } = useDataStore();
  const primaryColor = theme === 'nightfall' ? '#067ff9' : '#0f9f59';
  const latest = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2] ?? latest;

  const metrics = useMemo(() => {
    const pct = (a: number, b: number) => (((a - b) / Math.max(1, b)) * 100).toFixed(1);
    return [
      { label: 'Total Views', value: latest.views.toLocaleString(), trend: `${pct(latest.views, prev.views)}%`, isPositive: latest.views >= prev.views },
      { label: 'Subscribers', value: latest.subs.toLocaleString(), trend: `${pct(latest.subs, prev.subs)}%`, isPositive: latest.subs >= prev.subs },
      { label: 'Avg Revenue', value: `$${latest.revenue.toLocaleString()}`, trend: `${pct(latest.revenue, prev.revenue)}%`, isPositive: latest.revenue >= prev.revenue },
      { label: 'Published Videos', value: `${projects.filter((p) => p.status === 'Published').length}`, trend: 'live', isPositive: true },
    ];
  }, [latest, prev, projects]);

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-3xl font-black text-text-1 tracking-tight">Channel Analytics</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-text-1 text-lg mb-6">Views Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshots}>
                <defs><linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/><stop offset="95%" stopColor={primaryColor} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="views" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-text-1 text-lg mb-6">Subscriber Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshots}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="subs" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
