import { useState } from 'react';
import { Youtube, Link as LinkIcon, Moon, Sun, Users, Bell, Mail, Smartphone, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { AI_PROVIDERS, getProviderById, type AIProviderId } from '../lib/aiProviders';

export function Settings() {
  const { theme, setTheme } = useThemeStore();
  const { refreshIntervalMinutes, setRefreshIntervalMinutes, syncConnectedChannel } = useDataStore();
  const { provider, model, apiKey, youtubeApiKey, channelInput, setProvider, setModel, setApiKey, setYoutubeApiKey, setChannelInput, saveConfig, logout } = useAuthStore();
  const providerData = getProviderById(provider);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    digest: false
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-1 tracking-tight mb-2">Settings</h1>
        <p className="text-text-2">Manage your account, connected channels, and team preferences.</p>
      </div>


      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">AI API Configuration</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-text-1">Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value as AIProviderId)} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm">
                {AI_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-text-1">Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm">
                {providerData.models.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Or paste custom model id"
                className="w-full mt-2 bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-text-1">AI API Key</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={providerData.keyPlaceholder} className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-text-1">YouTube Channel URL / @handle</label>
              <input value={channelInput} onChange={(e) => setChannelInput(e.target.value)} placeholder="https://youtube.com/@yourchannel" className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-text-1">YouTube Data API Key</label>
              <input type="password" value={youtubeApiKey} onChange={(e) => setYoutubeApiKey(e.target.value)} placeholder="AIza..." className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={saveConfig} className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm">Save API Config</button>
            <button onClick={syncConnectedChannel} className="px-4 py-2 rounded-lg border border-primary text-primary font-bold text-sm">Sync Channel Data</button>
            <button onClick={logout} className="px-4 py-2 rounded-lg border border-danger/40 text-danger font-bold text-sm">Logout</button>
          </div>
        </div>
      </section>

      {/* Connected Channels */}
      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">Connected Channels</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-bg-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-danger rounded-full flex items-center justify-center text-white">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-1 text-lg">Alex's Tech Corner</h3>
                <p className="text-sm text-text-2">42.6K subscribers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
              <button className="text-sm font-bold text-danger hover:text-danger/80 transition-colors px-4 py-2 border border-danger/20 hover:bg-danger/10 rounded-lg">
                Disconnect
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            <LinkIcon className="w-4 h-4" /> Connect Another Channel
          </button>
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


      <section>
        <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-4">Data Refresh</h2>
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-text-2 mb-4">Choose how often the dashboard re-checks the existing data cache.</p>
          <div className="flex gap-2">
            {[1, 2].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setRefreshIntervalMinutes(minutes as 1 | 2)}
                className={cn('px-4 py-2 rounded-lg border text-sm font-bold', refreshIntervalMinutes === minutes ? 'bg-primary text-white border-primary' : 'border-border bg-bg-elevated text-text-2')}
              >
                Every {minutes} minute{minutes === 1 ? '' : 's'}
              </button>
            ))}
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
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-1 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="alex@creatorpulse.app"
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
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
