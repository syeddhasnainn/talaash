export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  title: string;
}

export type LLMProvider =
  | 'openai'
  | 'cerebras'
  | 'sambanova'
  | 'openrouter'
  | 'together';
