/**
 * Provider definitions with authentication methods and UI configuration
 */

export type AuthMethodType = 'api_key' | 'aws_credentials' | 'azure_ad' | 'oauth' | 'none'

export interface AuthMethodConfig {
  type: AuthMethodType
  displayName: string
  fields: AuthFieldConfig[]
  helpText?: string
}

export interface AuthFieldConfig {
  name: string
  label: string
  type: 'env_select' | 'text' | 'select' | 'url'
  placeholder?: string
  required: boolean
  options?: { value: string; label: string }[]
  helpText?: string
}

export interface ProviderConfig {
  id: string
  name: string
  displayName: string
  description: string
  authMethods: AuthMethodType[]
  defaultAuthMethod: AuthMethodType
  requiresEndpoint?: boolean
  endpointPlaceholder?: string
  documentation?: string
}

// Auth method configurations with UI helpers
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
  
  azure_ad: {
    type: 'azure_ad',
    displayName: 'Azure Active Directory',
    fields: [
      {
        name: 'azureApiKeyEnv',
        label: 'Azure API Key Environment Variable',
        type: 'env_select',
        placeholder: 'Select API key variable...',
        required: true
      },
      {
        name: 'azureEndpoint',
        label: 'Azure OpenAI Endpoint',
        type: 'url',
        placeholder: 'https://your-resource.openai.azure.com',
        required: true,
        helpText: 'Your Azure OpenAI resource endpoint'
      },
      {
        name: 'azureDeployment',
        label: 'Deployment Name',
        type: 'text',
        placeholder: 'gpt-4o-deployment',
        required: true,
        helpText: 'The name of your model deployment'
      },
      {
        name: 'azureApiVersion',
        label: 'API Version',
        type: 'text',
        placeholder: '2024-02-01',
        required: false,
        helpText: 'Optional: Override the API version'
      }
    ]
  },
  
  oauth: {
    type: 'oauth',
    displayName: 'OAuth 2.0',
    fields: [
      {
        name: 'clientIdEnv',
        label: 'Client ID Environment Variable',
        type: 'env_select',
        placeholder: 'Select client ID variable...',
        required: true
      },
      {
        name: 'clientSecretEnv',
        label: 'Client Secret Environment Variable',
        type: 'env_select',
        placeholder: 'Select client secret variable...',
        required: true
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

// Provider configurations
export const PROVIDERS: Record<string, ProviderConfig> = {
  anthropic: {
    id: 'anthropic',
    name: 'anthropic',
    displayName: 'Anthropic',
    description: 'Claude models via Anthropic API',
    authMethods: ['api_key'],
    defaultAuthMethod: 'api_key',
    documentation: 'https://docs.anthropic.com'
  },
  
  openai: {
    id: 'openai',
    name: 'openai',
    displayName: 'OpenAI',
    description: 'GPT models via OpenAI API',
    authMethods: ['api_key'],
    defaultAuthMethod: 'api_key',
    documentation: 'https://platform.openai.com/docs'
  },
  
  aws_bedrock: {
    id: 'aws_bedrock',
    name: 'aws_bedrock',
    displayName: 'AWS Bedrock',
    description: 'Models via AWS Bedrock',
    authMethods: ['aws_credentials'],
    defaultAuthMethod: 'aws_credentials',
    documentation: 'https://docs.aws.amazon.com/bedrock'
  },
  
  azure_openai: {
    id: 'azure_openai',
    name: 'azure_openai',
    displayName: 'Azure OpenAI',
    description: 'OpenAI models via Azure',
    authMethods: ['azure_ad'],
    defaultAuthMethod: 'azure_ad',
    documentation: 'https://learn.microsoft.com/azure/ai-services/openai'
  },
  
  gcp_vertex: {
    id: 'gcp_vertex',
    name: 'gcp_vertex',
    displayName: 'Google Cloud Vertex AI',
    description: 'Models via GCP Vertex AI',
    authMethods: ['oauth', 'api_key'],
    defaultAuthMethod: 'oauth',
    documentation: 'https://cloud.google.com/vertex-ai'
  },
  
  groq: {
    id: 'groq',
    name: 'groq',
    displayName: 'Groq',
    description: 'Fast inference via Groq Cloud',
    authMethods: ['api_key'],
    defaultAuthMethod: 'api_key',
    documentation: 'https://console.groq.com/docs'
  },
  
  together: {
    id: 'together',
    name: 'together',
    displayName: 'Together AI',
    description: 'Open models via Together AI',
    authMethods: ['api_key'],
    defaultAuthMethod: 'api_key',
    documentation: 'https://docs.together.ai'
  },
  
  replicate: {
    id: 'replicate',
    name: 'replicate',
    displayName: 'Replicate',
    description: 'Models via Replicate API',
    authMethods: ['api_key'],
    defaultAuthMethod: 'api_key',
    documentation: 'https://replicate.com/docs'
  },
  
  ollama: {
    id: 'ollama',
    name: 'ollama',
    displayName: 'Ollama',
    description: 'Local models via Ollama',
    authMethods: ['none'],
    defaultAuthMethod: 'none',
    requiresEndpoint: true,
    endpointPlaceholder: 'http://localhost:11434',
    documentation: 'https://ollama.ai'
  },
  
  custom: {
    id: 'custom',
    name: 'custom',
    displayName: 'Custom/Self-Hosted',
    description: 'Custom API endpoint',
    authMethods: ['api_key', 'none'],
    defaultAuthMethod: 'api_key',
    requiresEndpoint: true,
    endpointPlaceholder: 'https://your-api.com/v1'
  }
}

// Helper functions
export function getProvider(providerId: string): ProviderConfig | undefined {
  return PROVIDERS[providerId]
}

export function getAuthMethod(authType: AuthMethodType): AuthMethodConfig | undefined {
  return AUTH_METHODS[authType]
}

export function getProviderAuthMethods(providerId: string): AuthMethodConfig[] {
  const provider = PROVIDERS[providerId]
  if (!provider) return []
  
  return provider.authMethods
    .map(method => AUTH_METHODS[method])
    .filter(Boolean)
}