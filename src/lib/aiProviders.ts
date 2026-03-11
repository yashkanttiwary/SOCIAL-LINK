export type AIProviderId = 'gemini' | 'openrouter' | 'groq' | 'together' | 'huggingface' | 'openai';

export interface AIModelOption {
  value: string;
  label: string;
}

export interface AIProviderOption {
  id: AIProviderId;
  label: string;
  keyPlaceholder: string;
  endpointHint: string;
  docsUrl: string;
  models: AIModelOption[];
}

export const AI_PROVIDERS: AIProviderOption[] = [
  {
    id: 'gemini',
    label: 'Google Gemini API',
    keyPlaceholder: 'AIzaSy... (Gemini API key)',
    endpointHint: 'Google AI Studio key (latest models + free tier availability depends on account/region)',
    docsUrl: 'https://ai.google.dev/',
    models: [
      { value: 'gemini-3-pro', label: 'Gemini 3 Pro (Latest)' },
      { value: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro (Latest)' },
      { value: 'gemini-3.1-flash', label: 'Gemini 3.1 Flash' },
      { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    ],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter (free + paid models)',
    keyPlaceholder: 'sk-or-v1-... ',
    endpointHint: 'Use many providers behind one API key',
    docsUrl: 'https://openrouter.ai/docs',
    models: [
      { value: 'openai/gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
      { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B Instruct (Free)' },
      { value: 'qwen/qwen-2.5-72b-instruct:free', label: 'Qwen 2.5 72B Instruct (Free)' },
    ],
  },
  {
    id: 'groq',
    label: 'Groq API',
    keyPlaceholder: 'gsk_...',
    endpointHint: 'High-speed inference; free tier available',
    docsUrl: 'https://console.groq.com/docs',
    models: [
      { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { value: 'qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B Instruct' },
      { value: 'gemma2-9b-it', label: 'Gemma 2 9B IT' },
    ],
  },
  {
    id: 'together',
    label: 'Together AI',
    keyPlaceholder: '...Together API key...',
    endpointHint: 'Many open-source models; free credits often available',
    docsUrl: 'https://docs.together.ai/',
    models: [
      { value: 'meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo' },
      { value: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B Turbo' },
      { value: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo' },
      { value: 'mistralai/Mixtral-8x22B-Instruct-v0.1', label: 'Mixtral 8x22B Instruct' },
    ],
  },
  {
    id: 'huggingface',
    label: 'Hugging Face Inference API',
    keyPlaceholder: 'hf_...',
    endpointHint: 'Serverless API for open models (free + paid tiers)',
    docsUrl: 'https://huggingface.co/docs/api-inference/index',
    models: [
      { value: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B Instruct' },
      { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B Instruct' },
      { value: 'mistralai/Mistral-Large-Instruct-2411', label: 'Mistral Large Instruct' },
      { value: 'google/gemma-2-27b-it', label: 'Gemma 2 27B IT' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI API',
    keyPlaceholder: 'sk-... ',
    endpointHint: 'OpenAI platform models',
    docsUrl: 'https://platform.openai.com/docs',
    models: [
      { value: 'gpt-4.1', label: 'GPT-4.1' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    ],
  },
];

export const getProviderById = (id: AIProviderId) => AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0];
