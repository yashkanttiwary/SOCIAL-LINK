import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';
import { api } from '../lib/api';

const COLORS = ['#067ff9', '#10b981', '#f59e0b', '#8b5cf6'];

export function Analytics() {
  const { theme } = useThemeStore();
  const primaryColor = theme === 'nightfall' ? '#067ff9' : '#0f9f59';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await api.analytics.get();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const { metrics, timeSeriesData, topVideos, demoData, trafficData } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-text-1 tracking-tight">Channel Analytics</h1>
        <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-lg p-1">
          {['7d', '30d', '90d', 'Custom'].map((range, i) => (
            <button key={range} className={cn(
              "px-3 py-1.5 rounded-md text-sm font-bold transition-colors",
              i === 1 ? "bg-bg-elevated text-text-1 shadow-sm" : "text-text-3 hover:text-text-2"
            )}>
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary transition-colors group relative overflow-hidden">
            <p className="text-sm font-medium text-text-3 uppercase tracking-wider relative z-10">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-3 relative z-10">
              <h2 className="text-3xl font-black text-text-1">{m.value}</h2>
              <span className={cn(
                "flex items-center text-sm font-bold",
                m.isPositive ? "text-success" : "text-danger"
              )}>
                {m.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {m.trend}
              </span>
            </div>
            {/* Sparkline Mock */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData.slice(0, 10)}>
                  <Line type="monotone" dataKey="views" stroke={m.isPositive ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-text-1 text-lg mb-6">Views Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-1)' }}
                  itemStyle={{ color: 'var(--text-1)' }}
                />
                <Area type="monotone" dataKey="views" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscriber Growth */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-text-1 text-lg mb-6">Subscriber Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-1)' }}
                  itemStyle={{ color: 'var(--text-1)' }}
                />
                <Line type="monotone" dataKey="subs" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Videos */}
        <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6 overflow-hidden flex flex-col">
          <h3 className="font-bold text-text-1 text-lg mb-6">Top Performing Videos</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-text-3">
                  <th className="pb-3 font-medium">Video</th>
                  <th className="pb-3 font-medium">Views</th>
                  <th className="pb-3 font-medium">CTR</th>
                  <th className="pb-3 font-medium">Avg Watch</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topVideos.map((v, i) => (
                  <tr key={i} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-10 h-6 bg-bg-elevated rounded border border-border shrink-0"></div>
                      <span className="font-bold text-text-1 truncate max-w-[200px]">{v.title}</span>
                    </td>
                    <td className="py-3 font-medium text-text-2">{v.views}</td>
                    <td className="py-3 text-success font-bold">{v.ctr}</td>
                    <td className="py-3 text-text-2">{v.watchTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-text-1 text-lg mb-6">Audience Demographics</h3>
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="h-48">
              <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider mb-2 text-center">Age & Gender</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-3)' }} width={40} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="male" stackId="a" fill={primaryColor} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="female" stackId="a" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-48 flex flex-col items-center">
              <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider mb-2 text-center">Traffic Sources</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-text-1 text-lg mb-6">Revenue Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-3)' }} dx={-10} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-1)' }}
                itemStyle={{ color: 'var(--text-1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
