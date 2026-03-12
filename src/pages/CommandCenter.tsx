import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, CircleDashed, PlayCircle, Edit3, Eye, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export function CommandCenter() {
  const [data, setData] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [rulebook, setRulebook] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [summary, compData, rbData, canvasData] = await Promise.all([
          api.dashboard.summary(),
          api.research.competitors(),
          api.rulebook.get(),
          api.canvas.get()
        ]);
        setData(summary);
        setCompetitors(compData.competitors.slice(0, 2)); // Only show top 2 in dashboard
        setRulebook(rbData);
        setCanvas(canvasData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
    // Poll every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <div>
          <h3 className="text-lg font-bold text-danger">Failed to load dashboard</h3>
          <p className="text-sm text-danger/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data?.synced) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-primary-muted rounded-full flex items-center justify-center">
          <PlayCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-black text-text-1 mb-2">Connect Your Channel</h2>
          <p className="text-text-2 mb-6">Connect your YouTube channel to start analyzing your performance, tracking competitors, and generating AI insights.</p>
          <Link to="/settings" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const metrics = [
    { label: 'Total Views', value: formatNumber(data.channel.totalViews), trend: '+0.0%', isPositive: true },
    { label: 'Subscribers', value: formatNumber(data.channel.subscribers), trend: '+0.0%', isPositive: true },
    { label: 'Avg Watch Time', value: '--:--', trend: '0.0%', isPositive: true },
    { label: 'Est. Revenue', value: '---', trend: '0.0%', isPositive: true },
  ];

  const upcomingVideos = data.recentVideos.map((v: any) => ({
    date: new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: 'Published',
    title: v.title,
    color: 'bg-success'
  }));

  const activeRules = rulebook?.constraints?.slice(0, 2).map((c: any) => ({
    icon: c.type === 'must_include' ? CheckCircle2 : (c.type === 'must_avoid' ? AlertCircle : ShieldCheck),
    title: c.title,
    desc: c.desc
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-black text-text-1 tracking-tight">Command Center</h1>
        <p className="text-sm text-text-3">Last updated: {new Date(data.channel.updatedAt).toLocaleTimeString()}</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary transition-colors group">
            <p className="text-sm font-medium text-text-3 uppercase tracking-wider">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="text-3xl font-black text-text-1">{m.value}</h2>
              <span className={cn(
                "flex items-center text-sm font-bold",
                m.isPositive ? "text-success" : "text-danger"
              )}>
                {m.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Canvas Preview */}
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg-elevated">
              <h3 className="font-bold text-text-1 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Ideation Canvas: {canvas?.theme || 'Untitled'}
              </h3>
              <Link to="/canvas" className="text-sm font-bold text-primary hover:text-primary/80">Open Canvas →</Link>
            </div>
            <div className="flex-1 relative bg-bg-base overflow-hidden" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
              {/* Render actual notes (scaled down for preview) */}
              <div className="absolute inset-0 transform scale-75 origin-top-left p-8">
                {canvas?.notes?.slice(0, 4).map((note: any) => (
                  <div 
                    key={note.id}
                    className={cn("absolute w-40 h-40 rounded-lg shadow-md p-3 text-gray-800", note.color)}
                    style={{ 
                      left: note.x, 
                      top: note.y, 
                      transform: `rotate(${note.r || 0}deg)` 
                    }}
                  >
                    <p className="font-bold text-sm">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Insights */}
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text-1 text-lg">Competitor Insights</h3>
              <Link to="/research" className="text-sm font-bold text-primary hover:text-primary/80">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-text-3">
                    <th className="pb-3 font-medium">Competitor</th>
                    <th className="pb-3 font-medium">Top Strategy</th>
                    <th className="pb-3 font-medium">Monthly Views</th>
                    <th className="pb-3 font-medium">Engagement</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {competitors.map((c, i) => (
                    <tr key={i} className="border-b border-border hover:bg-bg-elevated transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-muted flex items-center justify-center text-primary font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-text-1">{c.name}</span>
                      </td>
                      <td className="py-4 text-text-2">{c.keywords?.[0] || 'N/A'}</td>
                      <td className="py-4 font-medium text-text-1">{c.subs}</td>
                      <td className="py-4 text-text-2">{c.growth}</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          c.growth.startsWith('+') ? "bg-primary-muted text-primary" : "bg-danger/10 text-danger"
                        )}>
                          {c.growth.startsWith('+') ? 'Trending' : 'Declining'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Planner Preview */}
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text-1 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Videos
              </h3>
              <Link to="/planner" className="text-sm font-bold text-primary hover:text-primary/80">Full Schedule →</Link>
            </div>
            <div className="space-y-4">
              {upcomingVideos.length === 0 ? (
                <p className="text-sm text-text-3">No videos found.</p>
              ) : upcomingVideos.map((v: any, i: number) => (
                <div key={i} className="flex gap-4 items-start group cursor-pointer">
                  <div className="flex flex-col items-center justify-center bg-bg-elevated rounded-lg p-2 min-w-[60px] border border-border group-hover:border-primary transition-colors">
                    <span className="text-xs text-text-3 uppercase font-bold">{v.date.split(' ')[0]}</span>
                    <span className="text-lg font-black text-text-1">{v.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1", v.color)}>
                      {v.status}
                    </span>
                    <p className="font-bold text-text-1 text-sm line-clamp-2 group-hover:text-primary transition-colors">{v.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Book Summary */}
          <div className="bg-bg-surface border border-border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text-1 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Active Rules
              </h3>
              <Link to="/rulebook" className="text-sm font-bold text-primary hover:text-primary/80">Edit Rules →</Link>
            </div>
            <div className="space-y-4">
              {activeRules.map((r, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-primary-muted flex items-center justify-center shrink-0">
                    <r.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text-1">{r.title}</p>
                    <p className="text-xs text-text-3 mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
