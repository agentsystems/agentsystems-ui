/**
 * Hosting Provider definitions with authentication methods and UI configuration
 * HostingProvider = Where models are hosted/served (e.g., Anthropic API, AWS Bedrock, GCP Vertex AI)
 * This is different from ModelVendor which is who created the model (e.g., Anthropic, Meta, OpenAI)
 */

export type AuthMethodType = 'api_key' | 'aws_credentials' | 'gcp_oauth' | 'none'

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
  
  none: {
    type: 'none',
    displayName: 'No Authentication',
    fields: [],
    helpText: 'No authentication required (for local/self-hosted models)'
  }
}

// Hosting Provider configurations - Limited to Anthropic API, AWS Bedrock, and GCP Vertex AI
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
  
  aws_bedrock: {
    id: 'aws_bedrock',
    name: 'aws_bedrock',
    displayName: 'AWS Bedrock',
    description: 'Claude models via AWS Bedrock',
    authMethods: ['aws_credentials'],
    defaultAuthMethod: 'aws_credentials',
    documentation: 'https://docs.aws.amazon.com/bedrock'
  },
  
  gcp_vertex: {
    id: 'gcp_vertex',
    name: 'gcp_vertex',
    displayName: 'Google Cloud Vertex AI',
    description: 'Claude models via GCP Vertex AI',
    authMethods: ['gcp_oauth'],
    defaultAuthMethod: 'gcp_oauth',
    documentation: 'https://cloud.google.com/vertex-ai'
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