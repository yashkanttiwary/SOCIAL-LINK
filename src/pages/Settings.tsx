import { useState, useEffect } from 'react';
import { Youtube, Link as LinkIcon, Moon, Sun, Users, Bell, Mail, Smartphone, Trash2, CheckCircle2, Key, Bot, Save, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';
import { api } from '../lib/api';

export function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    digest: false
  });

  const [aiConfig, setAiConfig] = useState({ provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '' });
  const [ytConfig, setYtConfig] = useState({ channelInput: '', apiKey: '' });
  const [savingAi, setSavingAi] = useState(false);
  const [savingYt, setSavingYt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [configData, setConfigData] = useState<any>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await api.config.current();
        setConfigData(data);
        if (data.ai) {
          setAiConfig({ provider: data.ai.provider, model: data.ai.model, apiKey: '********' });
        }
        if (data.youtube) {
          setYtConfig({ channelInput: data.youtube.channelInput, apiKey: '********' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSaveAi = async () => {
    setSavingAi(true);
    try {
      await api.config.saveAi(aiConfig);
      const data = await api.config.current();
      setConfigData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAi(false);
    }
  };

  const handleSaveYt = async () => {
    setSavingYt(true);
    try {
      await api.config.saveYoutube(ytConfig);
      const data = await api.config.current();
      setConfigData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingYt(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.sync.start();
      // In a real app, we'd poll for completion or use WebSockets
      setTimeout(() => setSyncing(false), 2500);
    } catch (err) {
      console.error(err);
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-1 tracking-tight mb-2">Settings</h1>
        <p className="text-text-2">Manage your account, connected channels, and team preferences.</p>
      </div>

      {/* AI Configuration */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bot className="w-4 h-4" /> AI Configuration
        </h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-1 mb-2">Provider</label>
              <select 
                value={aiConfig.provider}
                onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value})}
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-1 mb-2">Model</label>
              <input 
                type="text" 
                value={aiConfig.model}
                onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-1 mb-2">API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input 
                  type="password" 
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                  placeholder="Enter your API key"
                  className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
                />
              </div>
              <p className="text-xs text-text-3 mt-2">Your API key is encrypted at rest.</p>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <button 
              onClick={handleSaveAi}
              disabled={savingAi}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {savingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save AI Config
            </button>
          </div>
        </div>
      </section>

      {/* Connected Channels */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Youtube className="w-4 h-4" /> YouTube Integration
        </h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
          
          {configData?.youtube ? (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-bg-elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-danger rounded-full flex items-center justify-center text-white">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-1 text-lg">{configData.youtube.channelInput}</h3>
                  <p className="text-sm text-text-2">Connected via API Key</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </span>
                <button 
                  onClick={handleSync}
                  disabled={syncing}
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors px-4 py-2 border border-primary/20 hover:bg-primary/10 rounded-lg flex items-center gap-2"
                >
                  {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-1 mb-2">Channel ID or Handle</label>
                <input 
                  type="text" 
                  value={ytConfig.channelInput}
                  onChange={(e) => setYtConfig({...ytConfig, channelInput: e.target.value})}
                  placeholder="e.g. UC_x5XG1OV2P6uZZ5FSM9Ttw"
                  className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-1 mb-2">YouTube Data API v3 Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                  <input 
                    type="password" 
                    value={ytConfig.apiKey}
                    onChange={(e) => setYtConfig({...ytConfig, apiKey: e.target.value})}
                    placeholder="Enter your API key"
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
                  />
                </div>
              </div>
            </div>
          )}
          
          {!configData?.youtube && (
            <div className="flex justify-end pt-4 border-t border-border">
              <button 
                onClick={handleSaveYt}
                disabled={savingYt}
                className="flex items-center gap-2 px-4 py-2 bg-danger text-white font-bold rounded-lg hover:bg-danger/90 transition-colors disabled:opacity-50"
              >
                {savingYt ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                Connect Channel
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Appearance */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">Appearance</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setTheme('nightfall')}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200 group",
                theme === 'nightfall' ? "border-primary bg-primary-muted" : "border-border hover:border-text-3 bg-bg-elevated"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Moon className={cn("w-5 h-5", theme === 'nightfall' ? "text-primary" : "text-text-2")} />
                  <span className="font-bold text-text-1">Nightfall</span>
                </div>
                {theme === 'nightfall' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <div className="h-24 rounded-lg bg-[#0f1923] border border-[#2d3d4d] p-3 flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-[#1a2632] rounded"></div>
                <div className="h-8 w-full bg-[#1a2632] rounded border border-[#067ff9]"></div>
              </div>
            </button>
            
            <button 
              onClick={() => setTheme('clarity')}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200 group",
                theme === 'clarity' ? "border-primary bg-primary-muted" : "border-border hover:border-text-3 bg-bg-elevated"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sun className={cn("w-5 h-5", theme === 'clarity' ? "text-primary" : "text-text-2")} />
                  <span className="font-bold text-text-1">Clarity</span>
                </div>
                {theme === 'clarity' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <div className="h-24 rounded-lg bg-[#f6f8f7] border border-[#e2e8f0] p-3 flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-white rounded shadow-sm"></div>
                <div className="h-8 w-full bg-white rounded border border-[#0f9f59] shadow-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider">Team</h2>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            <Users className="w-4 h-4" /> Invite Member
          </button>
        </div>
        <div className="bg-bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between hover:bg-bg-elevated transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center text-primary font-bold">A</div>
              <div>
                <p className="font-bold text-text-1">Alex (You)</p>
                <p className="text-xs text-text-3">Owner</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-b border-border flex items-center justify-between hover:bg-bg-elevated transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success font-bold">S</div>
              <div>
                <p className="font-bold text-text-1">Sarah Editor</p>
                <p className="text-xs text-text-3">Editor • Joined Oct 12</p>
              </div>
            </div>
            <button className="text-text-3 hover:text-danger p-2 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">Notifications</h2>
        <div className="bg-bg-surface border border-border rounded-xl shadow-sm divide-y divide-border">
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-text-2 mt-0.5" />
              <div>
                <h3 className="font-bold text-text-1">Email Alerts</h3>
                <p className="text-sm text-text-2 mt-0.5">Receive emails for important updates and AI insights.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                notifications.email ? "bg-primary" : "bg-bg-elevated border border-border"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                notifications.email ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Bell className="w-5 h-5 text-text-2 mt-0.5" />
              <div>
                <h3 className="font-bold text-text-1">In-App Notifications</h3>
                <p className="text-sm text-text-2 mt-0.5">Show badge counts and toast messages.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(prev => ({ ...prev, inApp: !prev.inApp }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                notifications.inApp ? "bg-primary" : "bg-bg-elevated border border-border"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                notifications.inApp ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Smartphone className="w-5 h-5 text-text-2 mt-0.5" />
              <div>
                <h3 className="font-bold text-text-1">Weekly Digest</h3>
                <p className="text-sm text-text-2 mt-0.5">A summary of your channel's performance every Monday.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(prev => ({ ...prev, digest: !prev.digest }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                notifications.digest ? "bg-primary" : "bg-bg-elevated border border-border"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                notifications.digest ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">Account</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-text-1 mb-2">Name</label>
              <input 
                type="text" 
                defaultValue="Alex"
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-1 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="alex@creatorpulse.app"
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-text-1"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary-muted border border-primary/20 rounded-xl mb-6">
            <div>
              <h3 className="font-bold text-primary">Pro Plan</h3>
              <p className="text-sm text-primary/80">All features unlocked for all users.</p>
            </div>
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
          </div>
          <div className="pt-6 border-t border-border flex justify-end">
            <button className="text-sm font-bold text-danger hover:text-danger/80 transition-colors px-4 py-2 border border-danger/20 hover:bg-danger/10 rounded-lg">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
