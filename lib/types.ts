import { users } from "@/db/schema";

export type Chat = typeof users.$inferSelect;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
} 

export interface ChatSession {
  id: string;
  messages: Message[] | null;
  title: string;
}


export interface ModelCapabilities {
  supportsImages: boolean
}

export interface ModelConfig  {
  id: string, 
  name: string, 
  provider: LLMProvider,
  maxTokens: number,
  capabilities: ModelCapabilities
}

export interface ProviderConfig { 
  apiKey: string | undefined,
  models: ModelConfig[]
}

export type LLMProvider =
  | 'openai'
  | 'cerebras'
  | 'sambanova'
  | 'openrouter'
  | 'together';
