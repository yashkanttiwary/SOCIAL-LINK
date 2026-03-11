import { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, Clock, Plus, CheckCircle2, AlertCircle, Star, Trash2, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDataStore, type RuleConstraint } from '../store/dataStore';

const goals = [
  { id: 'brand', icon: Target, title: 'Brand Awareness', desc: 'Focus on reach and new viewers' },
  { id: 'conversion', icon: TrendingUp, title: 'High Conversion', desc: 'Focus on clicks and sales' },
  { id: 'engagement', icon: Clock, title: 'Engagement', desc: 'Focus on watch time and comments' },
];

const toggles = [
  { id: 'trending', icon: TrendingUp, title: 'Prioritize Trending Keywords', desc: 'AI will favor breakout topics over evergreen ones.' },
  { id: 'sfw', icon: ShieldCheck, title: 'Safe for Work Only', desc: 'Filter out controversial or mature topics.' },
  { id: 'factcheck', icon: CheckCircle2, title: 'Fact-Check Sources', desc: 'Verify claims against reliable sources.' },
  { id: 'longform', icon: Clock, title: 'Prioritize Long-form Content', desc: 'Suggest topics requiring 10+ minutes.' },
];

const iconForType: Record<RuleConstraint['type'], typeof CheckCircle2> = {
  must_include: CheckCircle2,
  must_avoid: AlertCircle,
  prefer: Star,
};

export function RuleBook() {
  const { ruleBook, updateRuleBook, addConstraint, updateConstraint, removeConstraint } = useDataStore();
  const [draft, setDraft] = useState({ title: '', desc: '', type: 'prefer' as RuleConstraint['type'] });
  const [savedTick, setSavedTick] = useState(false);

  const saveNow = () => {
    updateRuleBook({});
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-1 tracking-tight mb-2">Rule Book</h1>
          <p className="text-text-2">Operational rules that directly govern research, planning, and AI recommendations.</p>
          <p className="text-xs text-text-3 mt-2">Last updated: {new Date(ruleBook.updatedAt).toLocaleString()}</p>
        </div>
        <button onClick={saveNow} className={cn('px-4 py-2 rounded-lg text-sm font-bold border', savedTick ? 'bg-success text-white border-success' : 'bg-primary text-white border-primary')}><Save className="w-4 h-4 inline mr-1" /> {savedTick ? 'Saved' : 'Save Rules'}</button>
      </div>

      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">1. Goal Setting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => (
            <button key={g.id} onClick={() => updateRuleBook({ goal: g.id })} className={cn('p-6 rounded-xl border text-left transition-all', ruleBook.goal === g.id ? 'border-primary bg-primary-muted shadow-sm' : 'border-border bg-bg-surface hover:border-text-3')}>
              <g.icon className={cn('w-6 h-6 mb-3', ruleBook.goal === g.id ? 'text-primary' : 'text-text-3')} />
              <h3 className="font-bold text-text-1 mb-1">{g.title}</h3><p className="text-sm text-text-2">{g.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">2. Target Persona</h2>
        <div className="bg-bg-elevated border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Age Group & Interest</label>
            <input value={ruleBook.personaAge} onChange={(e) => updateRuleBook({ personaAge: e.target.value })} className="w-full bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Primary Motivation</label>
            <input value={ruleBook.personaMotivation} onChange={(e) => updateRuleBook({ personaMotivation: e.target.value })} className="w-full bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">3. Strategic Rules</h2>
        <div className="bg-bg-surface border border-border rounded-xl divide-y divide-border">
          {toggles.map((t) => (
            <div key={t.id} className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4"><div className="mt-0.5 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center"><t.icon className="w-4 h-4 text-text-2" /></div><div><h3 className="font-bold">{t.title}</h3><p className="text-sm text-text-2 mt-0.5">{t.desc}</p></div></div>
              <button onClick={() => updateRuleBook({ toggles: { ...ruleBook.toggles, [t.id]: !ruleBook.toggles[t.id] } })} className={cn('relative inline-flex h-6 w-11 items-center rounded-full', ruleBook.toggles[t.id] ? 'bg-primary' : 'bg-bg-elevated border border-border')}><span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', ruleBook.toggles[t.id] ? 'translate-x-6' : 'translate-x-1')} /></button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4"><h2 className="text-sm font-bold text-text-3 uppercase tracking-wider">4. Content Constraints</h2></div>
        <div className="bg-bg-surface border border-border rounded-xl p-4 mb-4">
          <div className="grid md:grid-cols-3 gap-2">
            <input value={draft.title} onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))} placeholder="Constraint title" className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={draft.desc} onChange={(e) => setDraft((s) => ({ ...s, desc: e.target.value }))} placeholder="Description" className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <select value={draft.type} onChange={(e) => setDraft((s) => ({ ...s, type: e.target.value as RuleConstraint['type'] }))} className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm flex-1"><option value="must_include">Must include</option><option value="must_avoid">Must avoid</option><option value="prefer">Prefer</option></select>
              <button onClick={() => { if (!draft.title.trim() || !draft.desc.trim()) return; addConstraint(draft); setDraft({ title: '', desc: '', type: 'prefer' }); }} className="px-3 py-2 rounded-lg bg-primary text-white font-bold text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ruleBook.constraints.map((c) => {
            const Icon = iconForType[c.type];
            return (
              <div key={c.id} className="bg-bg-surface border border-border rounded-xl p-4 shadow-sm flex items-start gap-4">
                <Icon className={cn('w-5 h-5 mt-2 shrink-0', c.type === 'must_avoid' ? 'text-danger' : c.type === 'must_include' ? 'text-success' : 'text-primary')} />
                <div className="grid md:grid-cols-2 gap-2 flex-1">
                  <input value={c.title} onChange={(e) => updateConstraint(c.id, { title: e.target.value })} className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm" />
                  <input value={c.desc} onChange={(e) => updateConstraint(c.id, { desc: e.target.value })} className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={() => removeConstraint(c.id)} className="p-2 text-text-3 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
