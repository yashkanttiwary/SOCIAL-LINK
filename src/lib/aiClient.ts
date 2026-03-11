import { type AIProviderId } from './aiProviders';

interface AIConfig {
  provider: AIProviderId;
  model: string;
  apiKey: string;
}

export interface AnalysisResponse {
  topic: string;
  searchInterestPct: number;
  searchVolume: number;
  competition: number;
  emergingTopics: string[];
  geography: Array<{ country: string; pct: number }>;
  activeHours: number[];
}

const promptFor = (query: string) => `Analyze this creator topic: "${query}".
Return ONLY JSON with keys: topic, searchInterestPct, searchVolume, competition, emergingTopics, geography, activeHours.
Rules:
- searchInterestPct: integer 40-180
- searchVolume: integer 1-100
- competition: integer 1-100
- emergingTopics: array of 4 hashtags
- geography: array of exactly 3 objects: {country, pct}
- activeHours: array of exactly 12 integers from 10-100`;

const parseJson = (text: string): AnalysisResponse => {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('No JSON in response');
  const obj = JSON.parse(text.slice(first, last + 1));
  return {
    topic: String(obj.topic ?? 'Untitled topic'),
    searchInterestPct: Number(obj.searchInterestPct ?? 90),
    searchVolume: Number(obj.searchVolume ?? 60),
    competition: Number(obj.competition ?? 50),
    emergingTopics: Array.isArray(obj.emergingTopics) ? obj.emergingTopics.slice(0, 4).map(String) : ['#CreatorGrowth', '#AudienceRetention', '#ContentOps', '#YouTubeSEO'],
    geography: Array.isArray(obj.geography) ? obj.geography.slice(0, 3).map((g: any) => ({ country: String(g.country ?? 'Unknown'), pct: Number(g.pct ?? 20) })) : [{ country: 'United States', pct: 40 }, { country: 'United Kingdom', pct: 20 }, { country: 'India', pct: 15 }],
    activeHours: Array.isArray(obj.activeHours) ? obj.activeHours.slice(0, 12).map(Number) : [20, 30, 40, 55, 75, 90, 100, 80, 60, 45, 30, 20],
  };
};

async function callOpenAICompatible(url: string, apiKey: string, model: string, prompt: string, extraHeaders?: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return String(json?.choices?.[0]?.message?.content ?? '');
}

export async function analyzeTopicWithProvider(query: string, config: AIConfig): Promise<AnalysisResponse> {
  const prompt = promptFor(query);

  if (config.provider === 'gemini') {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const json = await res.json();
    const text = String(json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
    return parseJson(text);
  }

  if (config.provider === 'openrouter') {
    const text = await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', config.apiKey, config.model, prompt, {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Social Link',
    });
    return parseJson(text);
  }

  if (config.provider === 'groq') {
    const text = await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', config.apiKey, config.model, prompt);
    return parseJson(text);
  }

  if (config.provider === 'together') {
    const text = await callOpenAICompatible('https://api.together.xyz/v1/chat/completions', config.apiKey, config.model, prompt);
    return parseJson(text);
  }

  if (config.provider === 'openai') {
    const text = await callOpenAICompatible('https://api.openai.com/v1/chat/completions', config.apiKey, config.model, prompt);
    return parseJson(text);
  }

  if (config.provider === 'huggingface') {
    const res = await fetch(`https://api-inference.huggingface.co/models/${config.model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({ inputs: prompt }),
    });
    if (!res.ok) throw new Error(`HF error: ${res.status}`);
    const json = await res.json();
    const text = Array.isArray(json) ? String(json[0]?.generated_text ?? '') : String(json?.generated_text ?? '');
    return parseJson(text);
  }

  throw new Error('Unsupported provider');
}
