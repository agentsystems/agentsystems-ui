/**
 * Model Catalog - Maps standardized model IDs to their provider-specific implementations
 * 
 * This catalog allows users to select models by standardized names (e.g., "claude-sonnet-4")
 * and automatically get the correct provider-specific model identifier.
 */

export interface ModelProvider {
  id: string
  name: string
  type?: string
  endpoint?: string
  auth_methods: string[]
  provider_model_id: string
  notes?: string
}

export interface ModelCatalogEntry {
  model_id: string
  display_name: string
  category: 'text' | 'multimodal' | 'code' | 'vision' | 'audio'
  description: string
  providers: ModelProvider[]
}

export const MODEL_CATALOG: ModelCatalogEntry[] = [
  // Claude Models
  {
    model_id: 'claude-sonnet-4',
    display_name: 'Claude Sonnet 4',
    category: 'text',
    description: 'Latest Claude model with enhanced reasoning and capabilities',
    providers: [
      {
        id: 'anthropic',
        name: 'Anthropic Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'claude-sonnet-4-20250514'
      },
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'anthropic.claude-sonnet-4-20250514-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/anthropic/models/claude-sonnet-4',
        notes: 'Use claude-sonnet-4@20250514 as provider_model_id'
      }
    ]
  },
  {
    model_id: 'claude-opus-4',
    display_name: 'Claude Opus 4',
    category: 'text',
    description: 'Most capable Claude model for complex reasoning tasks',
    providers: [
      {
        id: 'anthropic',
        name: 'Anthropic Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'claude-opus-4-20250514'
      },
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'anthropic.claude-opus-4-20250514-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/anthropic/models/claude-opus-4',
        notes: 'Use claude-opus-4@20250514 as provider_model_id'
      }
    ]
  },
  {
    model_id: 'claude-3-7-sonnet',
    display_name: 'Claude 3.7 Sonnet',
    category: 'text',
    description: 'Enhanced Claude 3 model with improved performance',
    providers: [
      {
        id: 'anthropic',
        name: 'Anthropic Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'claude-3-7-sonnet-20250219'
      },
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'anthropic.claude-3-7-sonnet-20250219-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/anthropic/models/claude-3-7-sonnet',
        notes: 'Use claude-3-7-sonnet@20250219 as provider_model_id'
      }
    ]
  },
  {
    model_id: 'claude-3-5-sonnet',
    display_name: 'Claude 3.5 Sonnet',
    category: 'text',
    description: 'Balanced Claude model for most use cases',
    providers: [
      {
        id: 'anthropic',
        name: 'Anthropic Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'claude-3-5-sonnet-20241022'
      },
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'anthropic.claude-3-5-sonnet-20241022-v2:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/anthropic/models/claude-3-5-sonnet-v2',
        notes: 'Use claude-3-5-sonnet-v2@20241022 as provider_model_id'
      }
    ]
  },
  {
    model_id: 'claude-3-5-haiku',
    display_name: 'Claude 3.5 Haiku',
    category: 'text',
    description: 'Fast and efficient Claude model for simple tasks',
    providers: [
      {
        id: 'anthropic',
        name: 'Anthropic Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'claude-3-5-haiku-20241022'
      },
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'anthropic.claude-3-5-haiku-20241022-v1:0'
      }
    ]
  },

  // GPT Models
  {
    model_id: 'gpt-4o',
    display_name: 'GPT-4o',
    category: 'multimodal',
    description: 'OpenAI\'s flagship multimodal model',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'gpt-4o'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'gpt-4o',
        notes: 'Requires deployment name configuration'
      }
    ]
  },
  {
    model_id: 'gpt-4o-mini',
    display_name: 'GPT-4o Mini',
    category: 'text',
    description: 'Smaller, faster version of GPT-4o',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'gpt-4o-mini'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'gpt-4o-mini',
        notes: 'Requires deployment name configuration'
      }
    ]
  },
  {
    model_id: 'gpt-4-1',
    display_name: 'GPT-4.1',
    category: 'text',
    description: 'Next generation GPT-4 with improved capabilities',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'gpt-4.1'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'azureml://registries/azure-openai/models/gpt-4.1-mini/versions/2025-04-14',
        notes: 'Azure ML registry format'
      }
    ]
  },
  {
    model_id: 'o3',
    display_name: 'OpenAI o3',
    category: 'text',
    description: 'Advanced reasoning model from OpenAI',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'o3'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'azureml://registries/azure-openai/models/o3/versions/2025-04-16',
        notes: 'Azure ML registry format'
      }
    ]
  },
  {
    model_id: 'o1',
    display_name: 'OpenAI o1',
    category: 'text',
    description: 'Reasoning-focused model for complex problems',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI Direct',
        auth_methods: ['api_key'],
        provider_model_id: 'o1'
      }
    ]
  },

  // Llama Models
  {
    model_id: 'llama-3-3-70b',
    display_name: 'Llama 3.3 70B',
    category: 'text',
    description: 'Meta\'s latest large language model',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'meta.llama3-3-70b-instruct-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/meta/models/llama3-3',
        notes: 'Use Llama-3-3-70B-Instruct as provider_model_id'
      }
    ]
  },
  {
    model_id: 'llama-4-scout-17b',
    display_name: 'Llama 4 Scout 17B',
    category: 'text',
    description: 'Meta\'s next-generation model',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'meta.llama4-scout-17b-instruct-v1:0'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'azureml://registries/azureml-meta/models/Llama-4-Scout-17B-16E/versions/1',
        notes: 'Azure ML registry format'
      }
    ]
  },
  {
    model_id: 'llama-3-1-8b',
    display_name: 'Llama 3.1 8B',
    category: 'text',
    description: 'Efficient Llama model for general use',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'meta.llama3-1-8b-instruct-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/meta/models/llama3_1',
        notes: 'Use Llama-3-1-8B-Instruct as provider_model_id'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        auth_methods: ['api_key', 'none'],
        provider_model_id: 'https://www.huggingface.co/meta-llama/llama-3.2-3b'
      }
    ]
  },

  // Amazon Nova Models
  {
    model_id: 'nova-pro',
    display_name: 'Amazon Nova Pro',
    category: 'multimodal',
    description: 'Amazon\'s flagship multimodal model',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'amazon.nova-pro-v1:0'
      }
    ]
  },
  {
    model_id: 'nova-lite',
    display_name: 'Amazon Nova Lite',
    category: 'text',
    description: 'Fast and cost-effective Amazon model',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'amazon.nova-lite-v1:0'
      }
    ]
  },
  {
    model_id: 'nova-micro',
    display_name: 'Amazon Nova Micro',
    category: 'text',
    description: 'Ultra-fast Amazon model for simple tasks',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'amazon.nova-micro-v1:0'
      }
    ]
  },

  // DeepSeek Models
  {
    model_id: 'deepseek-r1',
    display_name: 'DeepSeek R1',
    category: 'text',
    description: 'DeepSeek\'s reasoning model',
    providers: [
      {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        type: 'serverless',
        auth_methods: ['aws_credentials'],
        provider_model_id: 'deepseek.r1-v1:0'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/deepseek-ai/models/deepseek-r1',
        notes: 'Use deepseek-ai/DeepSeek-R1-0528 as provider_model_id'
      },
      {
        id: 'azure_openai',
        name: 'Azure OpenAI',
        auth_methods: ['azure_ad', 'api_key'],
        provider_model_id: 'azureml://registries/azureml-deepseek/models/DeepSeek-V3/versions/1',
        notes: 'Azure ML registry format'
      }
    ]
  },

  // Google Models
  {
    model_id: 'gemini-pro',
    display_name: 'Gemini Pro',
    category: 'multimodal',
    description: 'Google\'s flagship multimodal model',
    providers: [
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/google/models/gemini-pro',
        notes: 'Use google/gemini-1.0-pro as provider_model_id'
      }
    ]
  },
  {
    model_id: 'gemma-7b',
    display_name: 'Gemma 7B',
    category: 'text',
    description: 'Google\'s open-source language model',
    providers: [
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'publishers/google/models/gemma',
        notes: 'Use gemma-2b as provider_model_id'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        auth_methods: ['api_key', 'none'],
        provider_model_id: 'https://www.huggingface.co/google/gemma-7b-it'
      }
    ]
  },
  {
    model_id: 'gemma-3-12b',
    display_name: 'Gemma 3 12B',
    category: 'text',
    description: 'Latest Gemma model with improved capabilities',
    providers: [
      {
        id: 'gcp',
        name: 'Google Cloud Vertex AI',
        auth_methods: ['api_key'],
        provider_model_id: 'https://www.huggingface.co/google/gemma-3-12b-it'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        auth_methods: ['api_key', 'none'],
        provider_model_id: 'https://www.huggingface.co/google/gemma-3-12b-it'
      }
    ]
  }
]

/**
 * Get all unique standardized model IDs
 */
export function getModelIds(): string[] {
  return MODEL_CATALOG.map(entry => entry.model_id).sort()
}

/**
 * Get model entry by model ID
 */
export function getModelEntry(modelId: string): ModelCatalogEntry | undefined {
  return MODEL_CATALOG.find(entry => entry.model_id === modelId)
}

/**
 * Get available providers for a model
 */
export function getProvidersForModel(modelId: string): ModelProvider[] {
  const entry = getModelEntry(modelId)
  return entry ? entry.providers : []
}

/**
 * Get provider-specific model ID
 */
export function getProviderModelId(modelId: string, providerId: string): string | undefined {
  const providers = getProvidersForModel(modelId)
  const provider = providers.find(p => p.id === providerId)
  return provider?.provider_model_id
}

/**
 * Search models by text
 */
export function searchModels(query: string): ModelCatalogEntry[] {
  const lowerQuery = query.toLowerCase()
  return MODEL_CATALOG.filter(entry => 
    entry.model_id.toLowerCase().includes(lowerQuery) ||
    entry.display_name.toLowerCase().includes(lowerQuery) ||
    entry.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get models by category
 */
export function getModelsByCategory(category: string): ModelCatalogEntry[] {
  return MODEL_CATALOG.filter(entry => entry.category === category)
}

/**
 * Get unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(MODEL_CATALOG.map(entry => entry.category))).sort()
}