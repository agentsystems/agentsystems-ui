/**
 * Hosting Provider definitions with authentication methods and UI configuration
 * HostingProvider = Where models are hosted/served (e.g., Anthropic API, AWS Bedrock, GCP Vertex AI)
 * This is different from ModelVendor which is who created the model (e.g., Anthropic, Meta, OpenAI)
 */

export type AuthMethodType = 'api_key' | 'aws_credentials' | 'none'

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

export interface HostingProviderConfig {
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
  
  none: {
    type: 'none',
    displayName: 'No Authentication',
    fields: [],
    helpText: 'No authentication required (for local/self-hosted models)'
  }
}

// Hosting Provider configurations - Limited to Anthropic API, OpenAI API, and AWS Bedrock
export const HOSTING_PROVIDERS: Record<string, HostingProviderConfig> = {
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
    description: 'Claude, Llama, and other models via AWS Bedrock',
    authMethods: ['aws_credentials'],
    defaultAuthMethod: 'aws_credentials',
    documentation: 'https://docs.aws.amazon.com/bedrock'
  }
}

// Helper functions
export function getHostingProvider(hostingProviderId: string): HostingProviderConfig | undefined {
  return HOSTING_PROVIDERS[hostingProviderId]
}

export function getAuthMethod(authType: AuthMethodType): AuthMethodConfig | undefined {
  return AUTH_METHODS[authType]
}

export function getHostingProviderAuthMethods(hostingProviderId: string): AuthMethodConfig[] {
  const provider = HOSTING_PROVIDERS[hostingProviderId]
  if (!provider) return []
  
  return provider.authMethods
    .map(method => AUTH_METHODS[method])
    .filter(Boolean)
}