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
    endpointHint: 'Google AI Studio key (free tier available)',
    docsUrl: 'https://ai.google.dev/',
    models: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter (free + paid models)',
    keyPlaceholder: 'sk-or-v1-... ',
    endpointHint: 'Use many providers behind one API key',
    docsUrl: 'https://openrouter.ai/docs',
    models: [
      { value: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B Instruct (Free)' },
      { value: 'qwen/qwen-2.5-7b-instruct:free', label: 'Qwen 2.5 7B Instruct (Free)' },
      { value: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B IT (Free)' },
      { value: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B Instruct (Free)' },
      { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
    ],
  },
  {
    id: 'groq',
    label: 'Groq API',
    keyPlaceholder: 'gsk_...',
    endpointHint: 'High-speed inference; free tier available',
    docsUrl: 'https://console.groq.com/docs',
    models: [
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
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
      { value: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B Turbo' },
      { value: 'Qwen/Qwen2.5-7B-Instruct-Turbo', label: 'Qwen 2.5 7B Turbo' },
      { value: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct' },
      { value: 'google/gemma-2-9b-it', label: 'Gemma 2 9B IT' },
    ],
  },
  {
    id: 'huggingface',
    label: 'Hugging Face Inference API',
    keyPlaceholder: 'hf_...',
    endpointHint: 'Serverless API for open models (free + paid tiers)',
    docsUrl: 'https://huggingface.co/docs/api-inference/index',
    models: [
      { value: 'meta-llama/Meta-Llama-3-8B-Instruct', label: 'Llama 3 8B Instruct' },
      { value: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct' },
      { value: 'google/gemma-2-9b-it', label: 'Gemma 2 9B IT' },
      { value: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen 2.5 7B Instruct' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI API',
    keyPlaceholder: 'sk-... ',
    endpointHint: 'OpenAI platform models',
    docsUrl: 'https://platform.openai.com/docs',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
    ],
  },
];

export const getProviderById = (id: AIProviderId) => AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0];
