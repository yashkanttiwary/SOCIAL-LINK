import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { AI_PROVIDERS, getProviderById } from '../lib/aiProviders';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const { provider, model, apiKey, isConfigured, setProvider, setModel, setApiKey, saveConfig } = useAuthStore();
  const selected = useMemo(() => getProviderById(provider), [provider]);

  if (isConfigured) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-bg-base text-text-1 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl premium-surface border border-border rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black">Connect your AI provider</h1>
          <p className="text-text-2 mt-2">Enter an API key and choose a model. Research + AI actions will use this exact provider/model.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold block mb-2">API Provider</label>
            <select value={provider} onChange={(e) => setProvider(e.target.value as any)} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5">
              {AI_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <p className="text-xs text-text-3 mt-2">{selected.endpointHint}</p>
            <a href={selected.docsUrl} target="_blank" className="text-xs text-primary">Get API key docs →</a>
          </div>

          <div>
            <label className="text-sm font-bold block mb-2">Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5">
              {selected.models.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <p className="text-xs text-text-3 mt-2">Plenty of free/easy options are included (Gemini free tier, OpenRouter free models, Groq, Together, Hugging Face).</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={selected.keyPlaceholder} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5" />
          <p className="text-xs text-text-3 mt-2">Key is stored locally in your browser localStorage for this app session.</p>
        </div>

        <button onClick={saveConfig} disabled={!apiKey.trim()} className="w-full bg-primary disabled:opacity-50 text-white font-bold py-3 rounded-lg">Continue to Dashboard</button>
      </div>
    </div>
  );
}
