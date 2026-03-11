import { TrendingUp, TrendingDown, CheckCircle2, CircleDashed, PlayCircle, Edit3, Eye, Calendar, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Total Views', value: '1.28M', trend: '+15.2%', isPositive: true },
  { label: 'Subscribers', value: '42.6K', trend: '+8.4%', isPositive: true },
  { label: 'Avg Watch Time', value: '4:45', trend: '-2.1%', isPositive: false },
  { label: 'Est. Revenue', value: '$8.4K', trend: '+12%', isPositive: true },
];

const competitors = [
  { name: 'TechReview Pro', strategy: 'Hardware Reviews', views: '1.2M', engagement: '8.4%', status: 'Trending' },
  { name: 'Future Logic', strategy: 'AI Tutorials', views: '840K', engagement: '12.1%', status: 'Steady' },
  { name: 'Code With Sam', strategy: 'Live Coding', views: '2.5M', engagement: '4.2%', status: 'Declining' },
];

const upcomingVideos = [
  { date: 'Oct 24', status: 'Ideation', title: '10 Minimalist Desk Setup Tips', color: 'bg-warning' },
  { date: 'Oct 26', status: 'Filming', title: 'iPhone 15 Pro Max Review', color: 'bg-primary' },
  { date: 'Oct 28', status: 'Editing', title: 'Life of a Software Engineer', color: 'bg-indigo-500' },
];

const activeRules = [
  { icon: ShieldCheck, title: 'Fact-Check Sources', desc: 'Ensure all claims have citations' },
  { icon: TrendingUp, title: 'Prioritize Trending', desc: 'Focus on breakout keywords' },
  { icon: Eye, title: 'Safe for Work', desc: 'Avoid controversial topics' },
];

export function CommandCenter() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-text-1 tracking-tight">Command Center</h1>
      
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
                Ideation Canvas
              </h3>
              <Link to="/canvas" className="text-sm font-bold text-primary hover:text-primary/80">Open Canvas →</Link>
            </div>
            <div className="flex-1 relative bg-bg-base" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
              {/* Mock Sticky Notes */}
              <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-200 rounded-lg shadow-md p-3 rotate-[-3deg] text-gray-800">
                <p className="font-bold text-sm">Hook idea: Start with the messy desk</p>
              </div>
              <div className="absolute top-24 left-60 w-40 h-40 bg-green-200 rounded-lg shadow-md p-3 rotate-[2deg] text-gray-800">
                <p className="font-bold text-sm">Thumbnail: Split screen Before/After</p>
              </div>
              <div className="absolute top-40 left-20 w-40 h-40 bg-blue-200 rounded-lg shadow-md p-3 rotate-[-1deg] text-gray-800">
                <p className="font-bold text-sm">Sponsor integration at 3:00</p>
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
                      <td className="py-4 text-text-2">{c.strategy}</td>
                      <td className="py-4 font-medium text-text-1">{c.views}</td>
                      <td className="py-4 text-text-2">{c.engagement}</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          c.status === 'Trending' ? "bg-primary-muted text-primary" :
                          c.status === 'Steady' ? "bg-bg-elevated text-text-2" :
                          "bg-danger/10 text-danger"
                        )}>
                          {c.status}
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
                Up Next
              </h3>
              <Link to="/planner" className="text-sm font-bold text-primary hover:text-primary/80">Full Schedule →</Link>
            </div>
            <div className="space-y-4">
              {upcomingVideos.map((v, i) => (
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
