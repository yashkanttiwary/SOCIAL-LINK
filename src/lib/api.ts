// Simple API client
const API_BASE = '/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token'); // Mock token if needed
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    me: () => fetchApi('/auth/me'),
  },
  config: {
    current: () => fetchApi('/config/current'),
    saveAi: (data: any) => fetchApi('/config/ai', { method: 'POST', body: JSON.stringify(data) }),
    saveYoutube: (data: any) => fetchApi('/config/youtube', { method: 'POST', body: JSON.stringify(data) }),
  },
  sync: {
    start: () => fetchApi('/sync/youtube/start', { method: 'POST' }),
    runs: () => fetchApi('/sync/runs'),
  },
  dashboard: {
    summary: () => fetchApi('/dashboard/summary'),
  },
  planner: {
    list: () => fetchApi('/planner'),
    create: (data: any) => fetchApi('/planner', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/planner/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/planner/${id}`, { method: 'DELETE' }),
  },
  research: {
    competitors: () => fetchApi('/research/competitors'),
    addCompetitor: (data: any) => fetchApi('/research/competitors', { method: 'POST', body: JSON.stringify(data) }),
    trends: () => fetchApi('/research/trends'),
  },
  rulebook: {
    get: () => fetchApi('/rulebook'),
    save: (data: any) => fetchApi('/rulebook', { method: 'POST', body: JSON.stringify(data) }),
  },
  analytics: {
    get: () => fetchApi('/analytics'),
  },
  canvas: {
    get: () => fetchApi('/canvas'),
    save: (data: any) => fetchApi('/canvas', { method: 'POST', body: JSON.stringify(data) }),
  },
  ai: {
    canvasSuggestion: (theme: string) => fetchApi('/ai/canvas-suggestion', { method: 'POST', body: JSON.stringify({ theme }) }),
    insights: (context: string) => fetchApi('/ai/insights', { method: 'POST', body: JSON.stringify({ context }) }),
  },
  events: {
    track: (data: any) => fetchApi('/events/track', { method: 'POST', body: JSON.stringify(data) }),
  }
};
