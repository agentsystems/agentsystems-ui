/**
 * Configuration management type definitions for agentsystems-config.yml
 */

export type AuthMethod = 'none' | 'basic' | 'token'

// Model Connection Types for LLM routing
export type ModelProvider = 'anthropic' | 'aws_bedrock' | 'gcp_vertex' | 'openai' | 'azure_openai' | 'huggingface'

export interface ModelAuth {
  method: 'api_key' | 'aws_credentials' | 'gcp_oauth' | 'azure_ad' | 'none'
  api_key_env?: string
  // AWS Bedrock
  aws_access_key_env?: string  
  aws_secret_key_env?: string
  aws_region?: string
  // GCP Vertex AI
  gcp_service_account_key_env?: string
  gcp_project_id?: string
  gcp_region?: string
  // Azure AD
  azure_api_key_env?: string
  azure_endpoint?: string
  // Custom headers for self-hosted
  custom_headers?: Record<string, string>
}

export interface ModelConnection {
  model_id: string // Standardized ID like 'claude-sonnet-4', 'gpt-4o', 'llama-3.1-8b'
  hosting_provider: ModelProvider
  enabled: boolean
  // Hosting provider-specific model identifier (automatically populated from catalog)
  hosting_provider_model_id: string // e.g., 'claude-sonnet-4-20250514', 'anthropic.claude-sonnet-4-20250514-v1:0'
  endpoint?: string // For custom/self-hosted models or Ollama
  auth: ModelAuth
  // No config section - agent controls temperature, max_tokens, etc.
}

export interface RegistryAuth {
  method: AuthMethod
  username_env?: string
  password_env?: string
  token_env?: string
}

export interface RegistryConnection {
  url: string
  enabled: boolean
  auth: RegistryAuth
}

export interface AgentConfig {
  name: string
  repo: string
  tag: string
  registry_connection: string
  model_dependencies?: string[] // List of required model_ids (from agent.yaml)
  egress_allowlist?: string[]
  labels?: Record<string, string>
  artifact_permissions?: {
    readers?: string[]
    writers?: string[]
  }
  overrides?: {
    env?: Record<string, string>
    expose?: string[]
    [key: string]: unknown
  }
}

export interface AgentSystemsConfig {
  config_version: number
  registry_connections: Record<string, RegistryConnection>
  model_connections?: Record<string, ModelConnection>
  agents: AgentConfig[]
}

// Environment variable types for .env management
export interface EnvVariable {
  key: string
  value: string
  isSecret?: boolean
}

// Form types for UI components
export interface RegistryConnectionForm {
  id: string
  name: string
  url: string
  enabled: boolean
  authMethod: AuthMethod
  usernameEnv?: string
  passwordEnv?: string
  tokenEnv?: string
}

export interface ModelConnectionForm {
  id: string
  model_id: string
  hosting_provider: ModelProvider
  enabled: boolean
  hosting_provider_model_id: string // Auto-populated from catalog
  endpoint: string // For custom/ollama
  authMethod: 'api_key' | 'aws_credentials' | 'gcp_oauth' | 'azure_ad' | 'none'
  apiKeyEnv: string
  awsAccessKeyEnv: string
  awsSecretKeyEnv: string
  awsRegion: string
  gcpServiceAccountKeyEnv: string
  gcpProjectId: string
  gcpRegion: string
}

export interface AgentConfigForm extends Omit<AgentConfig, 'egress_allowlist' | 'overrides'> {
  id: string
  egressAllowlist: string // Comma-separated string for UI
  envVariables: Record<string, string>
  exposePorts: string // Comma-separated string for UI
}

// Validation types
export interface ValidationError {
  field: string
  message: string
}

export interface ConfigValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings?: ValidationError[]
}

// Configuration repository interface (for future abstraction)
export interface ConfigRepository {
  readConfig(): Promise<AgentSystemsConfig>
  writeConfig(config: AgentSystemsConfig): Promise<void>
  readEnvVars(): Promise<Record<string, string>>
  writeEnvVars(vars: Record<string, string>): Promise<void>
  backup(): Promise<void>
}