export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
} 

export interface ChatSession {
  id: string;
  messages: Message[] | null;
  title: string;
}

export type LLMProvider =
  | 'openai'
  | 'cerebras'
  | 'sambanova'
  | 'openrouter'
  | 'together';
