/**
 * Unified Model Catalog - Single source of truth for model routing configuration
 * 
 * This consolidates models, hosting providers, auth methods, and form fields
 * into one maintainable data structure while preserving the existing UX flow.
 */

export type ModelVendor = 'anthropic' | 'openai' | 'meta' | 'amazon' | 'google'
export type ModelCategory = 'text' | 'multimodal' | 'code' | 'vision' | 'audio' | 'fast'
export type HostingProviderId = 'anthropic' | 'amazon_bedrock' | 'openai' | 'ollama'
export type AuthMethodType = 'api_key' | 'aws_credentials' | 'ollama_auth' | 'none'

export interface AuthFieldConfig {
  name: string
  label: string
  type: 'env_select' | 'text' | 'select' | 'url'
  placeholder?: string
  required: boolean
  options?: { value: string; label: string }[]
  helpText?: string
}

export interface AuthMethodConfig {
  type: AuthMethodType
  displayName: string
  fields: AuthFieldConfig[]
  helpText?: string
}

export interface HostingProviderSupport {
  id: HostingProviderId
  displayName: string
  hostingProviderModelId: string
  authMethod: AuthMethodType
  requiresEndpoint?: boolean
  endpointPlaceholder?: string
  notes?: string
  documentation?: string
}

export interface ModelDefinition {
  id: string
  displayName: string
  vendor: ModelVendor
  category: ModelCategory
  description: string
  hostingProviders: HostingProviderSupport[]
}

// Auth method configurations with form fields
export const AUTH_METHODS: Record<AuthMethodType, AuthMethodConfig> = {
  api_key: {
    type: 'api_key',
    displayName: 'API Key',
    fields: [
      {
        name: 'apiKeyEnv',
        label: 'API Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select API key variable...',
        required: true,
        helpText: 'Select the environment variable containing your API key'
      }
    ]
  },
  
  aws_credentials: {
    type: 'aws_credentials',
    displayName: 'AWS Credentials',
    fields: [
      {
        name: 'awsAccessKeyEnv',
        label: 'AWS Access Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select access key variable...',
        required: true
      },
      {
        name: 'awsSecretKeyEnv',
        label: 'AWS Secret Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select secret key variable...',
        required: true
      },
      {
        name: 'awsRegion',
        label: 'AWS Region Environment Variable',
        type: 'env_select',
        placeholder: 'Select region variable...',
        required: true,
        helpText: 'Environment variable containing your AWS region (e.g., us-east-1, us-west-2)'
      },
      {
        name: 'regionPrefix',
        label: 'Region Prefix',
        type: 'text',
        placeholder: 'us (optional)',
        required: false,
        helpText: 'Region prefix for model IDs (e.g., "us", "eu") - leave blank if not needed'
      }
    ],
    helpText: 'AWS credentials for accessing Bedrock models'
  },
  
  ollama_auth: {
    type: 'ollama_auth',
    displayName: 'Ollama Authentication',
    fields: [
      {
        name: 'baseUrl',
        label: 'Ollama Server URL',
        type: 'env_select',
        placeholder: 'Select URL variable...',
        required: true,
        helpText: 'Environment variable containing your Ollama server URL'
      },
      {
        name: 'apiKeyEnv',
        label: 'API Key Environment Variable (Optional)',
        type: 'env_select',
        placeholder: 'Leave empty for local/network Ollama...',
        required: false,
        helpText: 'Only needed for authenticated remote Ollama deployments behind reverse proxies'
      }
    ],
    helpText: 'Configure connection to Ollama server with optional authentication'
  },
  
  none: {
    type: 'none',
    displayName: 'No Authentication',
    fields: [],
    helpText: 'No authentication required (for local/self-hosted models)'
  }
}

// Comprehensive model catalog with hosting provider support
export const MODELS: Record<string, ModelDefinition> = {
  // Claude Models
  'claude-opus-4-1': {
    id: 'claude-opus-4-1',
    displayName: 'Claude Opus 4.1',
    vendor: 'anthropic',
    category: 'multimodal',
    description: 'Most advanced Claude model with enhanced reasoning capabilities',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-opus-4-1-20250805',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-opus-4-1-20250805-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'claude-sonnet-4': {
    id: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    vendor: 'anthropic',
    category: 'text',
    description: 'Latest Claude model with enhanced reasoning and capabilities',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-sonnet-4-20250514',
        authMethod: 'api_key',
        documentation: 'https://docs.anthropic.com'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
        authMethod: 'aws_credentials',
        documentation: 'https://docs.aws.amazon.com/bedrock'
      }
    ]
  },

  'claude-sonnet-4-5': {
    id: 'claude-sonnet-4-5',
    displayName: 'Claude Sonnet 4.5',
    vendor: 'anthropic',
    category: 'text',
    description: 'Most advanced Claude Sonnet with enhanced capabilities for complex agents and coding',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-sonnet-4-5-20250929',
        authMethod: 'api_key',
        documentation: 'https://docs.anthropic.com'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-sonnet-4-5-20250929-v1:0',
        authMethod: 'aws_credentials',
        documentation: 'https://docs.aws.amazon.com/bedrock'
      }
    ]
  },

  'claude-opus-4': {
    id: 'claude-opus-4',
    displayName: 'Claude Opus 4',
    vendor: 'anthropic',
    category: 'text',
    description: 'Most capable Claude model for complex reasoning tasks',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-opus-4-20250514',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-opus-4-20250514-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'claude-sonnet-3-7': {
    id: 'claude-sonnet-3-7',
    displayName: 'Claude Sonnet 3.7',
    vendor: 'anthropic',
    category: 'text',
    description: 'Enhanced Claude 3.5 with improved capabilities',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-3-7-sonnet-20250219',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    vendor: 'anthropic',
    category: 'text',
    description: 'Balanced Claude model for most use cases',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-3-5-sonnet-20241022',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'claude-3-5-haiku': {
    id: 'claude-3-5-haiku',
    displayName: 'Claude 3.5 Haiku',
    vendor: 'anthropic',
    category: 'text',
    description: 'Fast and efficient Claude model for simple tasks',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-3-5-haiku-20241022',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'claude-haiku-3': {
    id: 'claude-haiku-3',
    displayName: 'Claude Haiku 3',
    vendor: 'anthropic',
    category: 'text',
    description: 'Original fast Claude model',
    hostingProviders: [
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        hostingProviderModelId: 'claude-3-haiku-20240307',
        authMethod: 'api_key'
      },
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  // OpenAI Frontier Models
  'gpt-5': {
    id: 'gpt-5',
    displayName: 'GPT-5',
    vendor: 'openai',
    category: 'multimodal',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-5',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-5-mini': {
    id: 'gpt-5-mini',
    displayName: 'GPT-5 mini',
    vendor: 'openai',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-5-mini',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-5-nano': {
    id: 'gpt-5-nano',
    displayName: 'GPT-5 nano',
    vendor: 'openai',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-5-nano',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-4o': {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    vendor: 'openai',
    category: 'multimodal',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-4o',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o mini',
    vendor: 'openai',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-4o-mini',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    vendor: 'openai',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-4-turbo',
        authMethod: 'api_key'
      }
    ]
  },

  'o1': {
    id: 'o1',
    displayName: 'o1',
    vendor: 'openai',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'o1',
        authMethod: 'api_key'
      }
    ]
  },

  'o1-mini': {
    id: 'o1-mini',
    displayName: 'o1-mini',
    vendor: 'openai',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'o1-mini',
        authMethod: 'api_key'
      }
    ]
  },

  'gpt-4.1': {
    id: 'gpt-4.1',
    displayName: 'GPT-4.1',
    vendor: 'openai',
    category: 'text',
    description: 'Smartest non-reasoning model',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI',
        hostingProviderModelId: 'gpt-4.1',
        authMethod: 'api_key'
      }
    ]
  },

  // Amazon Nova Models
  'nova-pro': {
    id: 'nova-pro',
    displayName: 'Amazon Nova Pro',
    vendor: 'amazon',
    category: 'multimodal',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'amazon.nova-pro-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'nova-premier': {
    id: 'nova-premier',
    displayName: 'Amazon Nova Premier',
    vendor: 'amazon',
    category: 'multimodal',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'amazon.nova-premier-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'nova-lite': {
    id: 'nova-lite',
    displayName: 'Amazon Nova Lite',
    vendor: 'amazon',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'amazon.nova-lite-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'nova-micro': {
    id: 'nova-micro',
    displayName: 'Amazon Nova Micro',
    vendor: 'amazon',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'amazon.nova-micro-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  // Llama Models (Ollama naming convention)
  'llama3.3:70b': {
    id: 'llama3.3:70b',
    displayName: 'Llama 3.3 70B Instruct',
    vendor: 'meta',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'meta.llama3-3-70b-instruct-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'llama3.3:70b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  'llama3.2:3b': {
    id: 'llama3.2:3b',
    displayName: 'Llama 3.2 3B Instruct',
    vendor: 'meta',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'llama3.2:3b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  'llama3.2:1b': {
    id: 'llama3.2:1b',
    displayName: 'Llama 3.2 1B Instruct',
    vendor: 'meta',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'llama3.2:1b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  // Google Gemma Models
  'gemma2:2b': {
    id: 'gemma2:2b',
    displayName: 'Gemma 2 2B Instruct',
    vendor: 'google',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'gemma2:2b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  'gemma3:4b': {
    id: 'gemma3:4b',
    displayName: 'Gemma 3 4B',
    vendor: 'google',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'gemma3:4b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  'gemma3:1b': {
    id: 'gemma3:1b',
    displayName: 'Gemma 3 1B',
    vendor: 'google',
    category: 'fast',
    description: '',
    hostingProviders: [
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'gemma3:1b',
        authMethod: 'ollama_auth'
      }
    ]
  },

  'llama3.1:8b': {
    id: 'llama3.1:8b',
    displayName: 'Llama 3.1 8B Instruct',
    vendor: 'meta',
    category: 'text',
    description: '',
    hostingProviders: [
      {
        id: 'amazon_bedrock',
        displayName: 'Amazon Bedrock',
        hostingProviderModelId: 'meta.llama3-1-8b-instruct-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'ollama',
        displayName: 'Ollama',
        hostingProviderModelId: 'llama3.1:8b',
        authMethod: 'ollama_auth'
      }
    ]
  },

}

// Helper functions with simplified API
export function getModel(modelId: string): ModelDefinition | undefined {
  return MODELS[modelId]
}

export function getModelsGroupedByVendor(): Record<ModelVendor, ModelDefinition[]> {
  const grouped: Partial<Record<ModelVendor, ModelDefinition[]>> = {}
  
  Object.values(MODELS).forEach(model => {
    if (!grouped[model.vendor]) {
      grouped[model.vendor] = []
    }
    grouped[model.vendor]!.push(model)
  })
  
  // Sort models within each vendor group
  Object.keys(grouped).forEach(vendor => {
    grouped[vendor as ModelVendor]!.sort((a, b) => a.displayName.localeCompare(b.displayName))
  })
  
  return grouped as Record<ModelVendor, ModelDefinition[]>
}

export function getHostingProvidersForModel(modelId: string): HostingProviderSupport[] {
  const model = MODELS[modelId]
  return model ? model.hostingProviders : []
}

export function getHostingProviderModelId(modelId: string, hostingProviderId: HostingProviderId): string | undefined {
  const model = MODELS[modelId]
  if (!model) return undefined
  
  const provider = model.hostingProviders.find(p => p.id === hostingProviderId)
  return provider?.hostingProviderModelId
}

export function getHostingProvider(hostingProviderId: HostingProviderId): HostingProviderSupport | undefined {
  // Find any model that supports this hosting provider to get the config
  for (const model of Object.values(MODELS)) {
    const provider = model.hostingProviders.find(p => p.id === hostingProviderId)
    if (provider) return provider
  }
  return undefined
}

export function getAllModels(): ModelDefinition[] {
  return Object.values(MODELS).sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export function getModelsByCategory(category: ModelCategory): ModelDefinition[] {
  return Object.values(MODELS)
    .filter(model => model.category === category)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export function searchModels(query: string): ModelDefinition[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(MODELS).filter(model => 
    model.id.toLowerCase().includes(lowerQuery) ||
    model.displayName.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery)
  )
}

// Types are already exported above, no need to re-export