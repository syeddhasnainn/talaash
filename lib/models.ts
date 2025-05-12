import { cerebras } from '@ai-sdk/cerebras';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { togetherai } from '@ai-sdk/togetherai';
import { LLMProvider, ModelConfig, ProviderConfig } from './types';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});



export const providerConfigs: Partial<Record<LLMProvider, ProviderConfig>> = {
  cerebras: {
    apiKey: process.env.CEREBRAS_API_KEY,
    models: [
      {
        id: 'llama3.3-70b',
        name: 'llama3',
        provider: 'cerebras',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
        },
      },
    ],
  },

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    models: [
      {
        id: 'qwen/qwen3-30b-a3b:free',
        name: 'qwen3-30b',
        provider: 'openrouter',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'google/gemini-2.5-flash-preview',
        name: 'gemini2.5-flash',
        provider: 'openrouter',
        maxTokens: 8192,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'opengvlab/internvl3-2b:free',
        name: 'internvl3-2b',
        provider: 'openrouter',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
        },
      }
    ],
  },

  together: {
    apiKey: process.env.TOGETHER_AI_API_KEY,
    models: [
      {
        id: 'google/gemma-3-27b-it',
        name: 'gemma3-27b-it',
        provider: 'together',
        maxTokens: 16384,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'llama3.1',
        provider: 'together',
        maxTokens: 8192,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'Qwen/Qwen3-235B-A22B-fp8-tput',
        name: 'qwen3-235b-fp8-tput',
        provider: 'together',
        maxTokens: 16384,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'deepseek-ai/DeepSeek-V3',
        name: 'deepseekv3-together',
        provider: 'together',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
        },
      },
      {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'deepseekr1-together',
        provider: 'together',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
        },
      },
    ],
  },
};

export const getProviderByModelName = (name:string): {instance: any, config: ModelConfig} | undefined => {
  for (const config of Object.values(providerConfigs)) {
    const model = config.models.find((model) => model.name === name);
    if (model) {
      return createModelInstance(model.provider, model.id);
    }
  }
  return undefined;
};

export const createModelInstance = (provider: LLMProvider, modelId: string): {
  instance: any, config: ModelConfig
} => {
  let modelInstance;
  const modelConfig = providerConfigs[provider]?.models.find((model: ModelConfig) => model.id === modelId);

  if (!modelConfig) throw new Error(`Model "${modelId}" not found for provider "${provider}".`);
  switch (provider) {
    case 'cerebras':
      modelInstance = cerebras(modelId);
      break;
    case 'openrouter':
      modelInstance = openrouter(modelId);
      break;
    case 'together':
      modelInstance = togetherai(modelId);
      break;
    default:
      throw new Error('Invalid provider');
  }

  return {
    instance: modelInstance,
    config: modelConfig,
  }
};
