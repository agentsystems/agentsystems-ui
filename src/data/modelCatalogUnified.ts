/**
 * Unified Model Catalog - Single source of truth for model routing configuration
 * 
 * This consolidates models, hosting providers, auth methods, and form fields
 * into one maintainable data structure while preserving the existing UX flow.
 */

export type ModelVendor = 'anthropic' | 'openai' | 'meta' | 'amazon' | 'deepseek' | 'google'
export type ModelCategory = 'text' | 'multimodal' | 'code' | 'vision' | 'audio'
export type HostingProviderId = 'anthropic' | 'aws_bedrock' | 'gcp_vertex' | 'openai' | 'azure_openai' | 'huggingface'
export type AuthMethodType = 'api_key' | 'aws_credentials' | 'gcp_oauth' | 'azure_ad' | 'none'

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
  providerModelId: string
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
        label: 'AWS Region',
        type: 'select',
        required: true,
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-west-1', label: 'Europe (Ireland)' },
          { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
          { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
          { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
        ]
      }
    ],
    helpText: 'AWS credentials for accessing Bedrock models'
  },
  
  gcp_oauth: {
    type: 'gcp_oauth',
    displayName: 'Google Cloud OAuth',
    fields: [
      {
        name: 'gcpServiceAccountKeyEnv',
        label: 'Service Account Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select service account key variable...',
        required: true,
        helpText: 'Environment variable containing the GCP service account JSON key'
      },
      {
        name: 'gcpProjectId',
        label: 'GCP Project ID',
        type: 'text',
        placeholder: 'my-project-id',
        required: true,
        helpText: 'Your Google Cloud project ID'
      },
      {
        name: 'gcpRegion',
        label: 'GCP Region',
        type: 'select',
        required: true,
        options: [
          { value: 'us-central1', label: 'US Central (Iowa)' },
          { value: 'us-east1', label: 'US East (South Carolina)' },
          { value: 'us-west1', label: 'US West (Oregon)' },
          { value: 'europe-west1', label: 'Europe West (Belgium)' },
          { value: 'europe-west4', label: 'Europe West (Netherlands)' },
          { value: 'asia-southeast1', label: 'Asia Southeast (Singapore)' },
          { value: 'asia-northeast1', label: 'Asia Northeast (Tokyo)' }
        ]
      }
    ]
  },

  azure_ad: {
    type: 'azure_ad',
    displayName: 'Azure AD',
    fields: [
      {
        name: 'azureApiKeyEnv',
        label: 'Azure API Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select Azure API key variable...',
        required: true
      },
      {
        name: 'azureEndpoint',
        label: 'Azure Endpoint',
        type: 'url',
        placeholder: 'https://your-resource.openai.azure.com/',
        required: true,
        helpText: 'Your Azure OpenAI resource endpoint'
      }
    ]
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
        providerModelId: 'claude-sonnet-4-20250514',
        authMethod: 'api_key',
        documentation: 'https://docs.anthropic.com'
      },
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
        authMethod: 'aws_credentials',
        documentation: 'https://docs.aws.amazon.com/bedrock'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/anthropic/models/claude-sonnet-4',
        authMethod: 'gcp_oauth',
        notes: 'Use claude-sonnet-4@20250514 as provider_model_id',
        documentation: 'https://cloud.google.com/vertex-ai'
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
        providerModelId: 'claude-opus-4-20250514',
        authMethod: 'api_key'
      },
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'anthropic.claude-opus-4-20250514-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/anthropic/models/claude-opus-4',
        authMethod: 'gcp_oauth',
        notes: 'Use claude-opus-4@20250514 as provider_model_id'
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
        providerModelId: 'claude-3-5-sonnet-20241022',
        authMethod: 'api_key'
      },
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/anthropic/models/claude-3-5-sonnet-v2',
        authMethod: 'gcp_oauth',
        notes: 'Use claude-3-5-sonnet-v2@20241022 as provider_model_id'
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
        providerModelId: 'claude-3-5-haiku-20241022',
        authMethod: 'api_key'
      },
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  // GPT Models
  'gpt-4o': {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    vendor: 'openai',
    category: 'multimodal',
    description: 'OpenAI\'s flagship multimodal model',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI Direct',
        providerModelId: 'gpt-4o',
        authMethod: 'api_key'
      },
      {
        id: 'azure_openai',
        displayName: 'Azure OpenAI',
        providerModelId: 'gpt-4o',
        authMethod: 'azure_ad',
        notes: 'Requires deployment name configuration',
        requiresEndpoint: true,
        endpointPlaceholder: 'https://your-resource.openai.azure.com/'
      }
    ]
  },

  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    vendor: 'openai',
    category: 'text',
    description: 'Smaller, faster version of GPT-4o',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI Direct',
        providerModelId: 'gpt-4o-mini',
        authMethod: 'api_key'
      },
      {
        id: 'azure_openai',
        displayName: 'Azure OpenAI',
        providerModelId: 'gpt-4o-mini',
        authMethod: 'azure_ad',
        requiresEndpoint: true,
        endpointPlaceholder: 'https://your-resource.openai.azure.com/'
      }
    ]
  },

  'o1': {
    id: 'o1',
    displayName: 'OpenAI o1',
    vendor: 'openai',
    category: 'text',
    description: 'Reasoning-focused model for complex problems',
    hostingProviders: [
      {
        id: 'openai',
        displayName: 'OpenAI Direct',
        providerModelId: 'o1',
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
    description: 'Amazon\'s flagship multimodal model',
    hostingProviders: [
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'amazon.nova-pro-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  'nova-lite': {
    id: 'nova-lite',
    displayName: 'Amazon Nova Lite',
    vendor: 'amazon',
    category: 'text',
    description: 'Fast and cost-effective Amazon model',
    hostingProviders: [
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'amazon.nova-lite-v1:0',
        authMethod: 'aws_credentials'
      }
    ]
  },

  // Llama Models
  'llama-3-3-70b': {
    id: 'llama-3-3-70b',
    displayName: 'Llama 3.3 70B',
    vendor: 'meta',
    category: 'text',
    description: 'Meta\'s latest large language model',
    hostingProviders: [
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'meta.llama3-3-70b-instruct-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/meta/models/llama3-3',
        authMethod: 'gcp_oauth',
        notes: 'Use Llama-3-3-70B-Instruct as provider_model_id'
      }
    ]
  },

  'llama-3-1-8b': {
    id: 'llama-3-1-8b',
    displayName: 'Llama 3.1 8B',
    vendor: 'meta',
    category: 'text',
    description: 'Efficient Llama model for general use',
    hostingProviders: [
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'meta.llama3-1-8b-instruct-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/meta/models/llama3_1',
        authMethod: 'gcp_oauth',
        notes: 'Use Llama-3-1-8B-Instruct as provider_model_id'
      },
      {
        id: 'huggingface',
        displayName: 'Hugging Face',
        providerModelId: 'meta-llama/llama-3.2-3b',
        authMethod: 'api_key',
        requiresEndpoint: true,
        endpointPlaceholder: 'https://api-inference.huggingface.co/models/'
      }
    ]
  },

  // DeepSeek Models
  'deepseek-r1': {
    id: 'deepseek-r1',
    displayName: 'DeepSeek R1',
    vendor: 'deepseek',
    category: 'text',
    description: 'DeepSeek\'s reasoning model',
    hostingProviders: [
      {
        id: 'aws_bedrock',
        displayName: 'AWS Bedrock',
        providerModelId: 'deepseek.r1-v1:0',
        authMethod: 'aws_credentials'
      },
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/deepseek-ai/models/deepseek-r1',
        authMethod: 'gcp_oauth',
        notes: 'Use deepseek-ai/DeepSeek-R1-0528 as provider_model_id'
      }
    ]
  },

  // Google Models
  'gemini-pro': {
    id: 'gemini-pro',
    displayName: 'Gemini Pro',
    vendor: 'google',
    category: 'multimodal',
    description: 'Google\'s flagship multimodal model',
    hostingProviders: [
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/google/models/gemini-pro',
        authMethod: 'gcp_oauth',
        notes: 'Use google/gemini-1.0-pro as provider_model_id'
      }
    ]
  },

  'gemma-7b': {
    id: 'gemma-7b',
    displayName: 'Gemma 7B',
    vendor: 'google',
    category: 'text',
    description: 'Google\'s open-source language model',
    hostingProviders: [
      {
        id: 'gcp_vertex',
        displayName: 'Google Cloud Vertex AI',
        providerModelId: 'publishers/google/models/gemma',
        authMethod: 'gcp_oauth',
        notes: 'Use gemma-2b as provider_model_id'
      },
      {
        id: 'huggingface',
        displayName: 'Hugging Face',
        providerModelId: 'google/gemma-7b-it',
        authMethod: 'api_key',
        requiresEndpoint: true,
        endpointPlaceholder: 'https://api-inference.huggingface.co/models/'
      }
    ]
  }
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
  return provider?.providerModelId
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

// Export types for external use
export type { 
  ModelDefinition, 
  HostingProviderSupport, 
  AuthMethodConfig, 
  AuthFieldConfig,
  ModelVendor,
  ModelCategory,
  HostingProviderId,
  AuthMethodType
}