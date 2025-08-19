/**
 * Configuration management type definitions for agentsystems-config.yml
 */

export type AuthMethod = 'none' | 'basic' | 'token'

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