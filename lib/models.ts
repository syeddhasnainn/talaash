import { openai } from '@ai-sdk/openai';
import { cerebras } from '@ai-sdk/cerebras';
import { sambanova } from 'sambanova-ai-provider';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { togetherai } from '@ai-sdk/togetherai';
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
export const providerConfigs = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
    ],
  },

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
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
    ],
  },

  sambanova: {
    apiKey: process.env.SAMBANOVA_API_KEY,
    models: [
      {
        id: 'DeepSeek-V3-0324',
        name: 'deepseek3',
        provider: 'sambanova',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
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
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
      // {
      //   id: 'google/gemini-2.5-flash-preview',
      //   name: 'gemini2.5-flash',
      //   provider: 'openrouter',
      //   maxTokens: 8192,
      //   capabilities: {
      //     supportsImages: true,
      //     supportsCode: true,
      //     supportsStructuredOutput: true,
      //     supportsFunctions: true,
      //   },
      // },
      {
        id : 'opengvlab/internvl3-2b:free',
        name: 'internvl3-2b',
        provider: 'openrouter',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      }
    ],
  },

  together: {
    apiKey: process.env.TOGETHER_AI_API_KEY,
    models: [
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'llama3.1',
        provider: 'together',
        maxTokens: 8192,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
      {
        id: 'Qwen/Qwen3-235B-A22B-fp8-tput',
        name: 'qwen3-235b-fp8-tput',
        provider: 'together',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
      {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'deepseekr1-together',
        provider: 'together',
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsCode: true,
          supportsStructuredOutput: true,
          supportsFunctions: true,
        },
      },
    ],
  },
};

export const getProviderByModelName = (name: string) => {
  for (const config of Object.values(providerConfigs)) {
    const model = config.models.find((model) => model.name === name);
    if (model) {
      return createModelInstance(model.provider, model.id);
    }
  }
  return null;
};

export const createModelInstance = (provider: string, modelId: string) => {
  switch (provider) {
    case 'openai':
      return openai(modelId);
    case 'cerebras':
      return cerebras(modelId);
    case 'sambanova':
      return sambanova(modelId);
    case 'openrouter':
      return openrouter(modelId);
    case 'together':
      return togetherai(modelId);
    default:
      throw new Error('Invalid provider');
  }
};
