import { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, Clock, Plus, CheckCircle2, AlertCircle, Star, Trash2, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';

const goals = [
  { id: 'brand', icon: Target, title: 'Brand Awareness', desc: 'Focus on reach and new viewers' },
  { id: 'conversion', icon: TrendingUp, title: 'High Conversion', desc: 'Focus on clicks and sales' },
  { id: 'engagement', icon: Clock, title: 'Engagement', desc: 'Focus on watch time and comments' },
];

const toggles = [
  { id: 'trending', icon: TrendingUp, title: 'Prioritize Trending Keywords', desc: 'AI will favor breakout topics over evergreen ones.', defaultChecked: true },
  { id: 'sfw', icon: ShieldCheck, title: 'Safe for Work Only', desc: 'Filter out any controversial or mature topics.', defaultChecked: false },
  { id: 'factcheck', icon: CheckCircle2, title: 'Fact-Check Sources', desc: 'AI will verify claims against reliable sources.', defaultChecked: true },
  { id: 'longform', icon: Clock, title: 'Prioritize Long-form Content', desc: 'Suggest topics that require 10+ minutes to cover.', defaultChecked: false },
];

const constraints = [
  { id: 1, type: 'must_include', icon: CheckCircle2, iconColor: 'text-success', title: 'Always mention sustainability', desc: 'Ensure every script includes a brief note on eco-friendly practices.' },
  { id: 2, type: 'must_avoid', icon: AlertCircle, iconColor: 'text-danger', title: 'Avoid controversial topics', desc: 'Keep research focused on technology, avoid politics.' },
  { id: 3, type: 'prefer', icon: Star, iconColor: 'text-primary', title: 'Prioritize local manufacturers', desc: 'When comparing brands, highlight US-based companies.' },
];

export function RuleBook() {
  const [activeGoal, setActiveGoal] = useState('brand');
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(
    toggles.reduce((acc, t) => ({ ...acc, [t.id]: t.defaultChecked }), {})
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-1 tracking-tight mb-2">Rule Book</h1>
        <p className="text-text-2">Define the goals and constraints for your AI assistant's research and content strategy.</p>
      </div>

      {/* Goal Setting */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">1. Goal Setting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGoal(g.id)}
              className={cn(
                "p-6 rounded-xl border text-left transition-all duration-200",
                activeGoal === g.id 
                  ? "border-primary bg-primary-muted shadow-sm" 
                  : "border-border bg-bg-surface hover:border-text-3"
              )}
            >
              <g.icon className={cn("w-6 h-6 mb-3", activeGoal === g.id ? "text-primary" : "text-text-3")} />
              <h3 className="font-bold text-text-1 mb-1">{g.title}</h3>
              <p className="text-sm text-text-2">{g.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Target Persona */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">2. Target Persona</h2>
        <div className="bg-bg-elevated border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-text-1 mb-2">Age Group & Interest</label>
            <input 
              type="text" 
              defaultValue="25-35, Eco-conscious Tech Enthusiasts"
              className="w-full bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-1 mb-2">Primary Motivation</label>
            <input 
              type="text" 
              defaultValue="Finding sustainable alternatives to daily electronics"
              className="w-full bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Strategic Rules */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">3. Strategic Rules</h2>
        <div className="bg-bg-surface border border-border rounded-xl divide-y divide-border">
          {toggles.map(t => (
            <div key={t.id} className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center shrink-0">
                  <t.icon className="w-4 h-4 text-text-2" />
                </div>
                <div>
                  <h3 className="font-bold text-text-1">{t.title}</h3>
                  <p className="text-sm text-text-2 mt-0.5">{t.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveToggles(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  activeToggles[t.id] ? "bg-primary" : "bg-bg-elevated border border-border"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  activeToggles[t.id] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Content Constraints */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider">4. Content Constraints</h2>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            <Plus className="w-4 h-4" /> Add Constraint
          </button>
        </div>
        <div className="space-y-4">
          {constraints.map(c => (
            <div key={c.id} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex items-start justify-between gap-4 group">
              <div className="flex items-start gap-4">
                <c.icon className={cn("w-5 h-5 mt-0.5 shrink-0", c.iconColor)} />
                <div>
                  <h3 className="font-bold text-text-1">{c.title}</h3>
                  <p className="text-sm text-text-2 mt-1">{c.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-text-3 hover:text-text-1 hover:bg-bg-elevated rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-text-3 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-border">
        <button className="px-6 py-2.5 rounded-lg font-bold text-text-2 border border-border hover:bg-bg-elevated transition-colors">
          Discard Changes
        </button>
        <button className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors">
          Save Rule Book
        </button>
      </div>
    </div>
  );
}
