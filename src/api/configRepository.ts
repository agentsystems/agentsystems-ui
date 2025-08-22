import { AgentSystemsConfig, ConfigRepository } from '../types/config'
import { api } from './client'

/**
 * File-based configuration repository that reads/writes agentsystems-config.yml and .env files
 * directly through API endpoints that will be added to the gateway.
 * 
 * For now, we'll implement this as API calls that the gateway will need to support.
 * Later this can be evolved to work with database storage.
 */
export class FileConfigRepository implements ConfigRepository {
  constructor(_configPath = './agentsystems-config.yml', _envPath = './.env') {
    // Parameters stored for potential future use
    void _configPath; // Acknowledge parameter
    void _envPath; // Acknowledge parameter
  }

  async readConfig(): Promise<AgentSystemsConfig> {
    try {
      // Call the gateway API endpoint for reading config
      const response = await api.get<AgentSystemsConfig>('/api/config/agentsystems-config')
      return response
    } catch (error) {
      console.error('Failed to read agentsystems-config.yml:', error)
      // Return default config if file doesn't exist or is invalid
      return {
        config_version: 1,
        registry_connections: {},
        model_connections: {},
        agents: []
      }
    }
  }

  async writeConfig(config: AgentSystemsConfig): Promise<void> {
    try {
      // Validate config before writing
      this.validateConfig(config)
      
      // Create backup before writing
      await this.backup()
      
      // Write to file via API endpoint
      await api.put('/api/config/agentsystems-config', config)
    } catch (error) {
      console.error('Failed to write agentsystems-config.yml:', error)
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async readEnvVars(): Promise<Record<string, string>> {
    try {
      // Call the gateway API endpoint for reading env vars
      const response = await api.get<Record<string, string>>('/api/config/env')
      return response
    } catch (error) {
      console.error('Failed to read .env file:', error)
      return {}
    }
  }

  async writeEnvVars(vars: Record<string, string>): Promise<void> {
    try {
      // Validate environment variables
      this.validateEnvVars(vars)
      
      // Create backup before writing
      await this.backup()
      
      // Write env vars via API endpoint
      await api.put('/api/config/env', vars)
    } catch (error) {
      console.error('Failed to write .env file:', error)
      throw new Error(`Failed to save environment variables: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async backup(): Promise<void> {
    try {
      // Create backup via API endpoint
      await api.post('/api/config/backup')
    } catch (error) {
      console.warn('Failed to create backup:', error)
      // Don't throw - backup failure shouldn't prevent saving
    }
  }

  /**
   * Validate agentsystems config structure and relationships
   */
  private validateConfig(config: AgentSystemsConfig): void {
    if (!config.config_version || config.config_version < 1) {
      throw new Error('Invalid config_version')
    }

    // Validate registry connections
    Object.entries(config.registry_connections || {}).forEach(([id, registry]) => {
      if (!registry.url) {
        throw new Error(`Registry "${id}": URL is required`)
      }
      
      // Allow both HTTP URLs and Docker registry hostnames (like docker.io)
      if (!registry.url.match(/^(https?:\/\/|[a-zA-Z0-9.-]+)$/)) {
        throw new Error(`Registry "${id}": Invalid URL format`)
      }

      if (registry.auth.method === 'basic') {
        if (!registry.auth.username_env || !registry.auth.password_env) {
          throw new Error(`Registry "${id}": Basic auth requires username_env and password_env`)
        }
      } else if (registry.auth.method === 'token') {
        if (!registry.auth.token_env) {
          throw new Error(`Registry "${id}": Token auth requires token_env`)
        }
      }
    })

    // Validate agents
    const registryIds = Object.keys(config.registry_connections || {})
    config.agents?.forEach((agent, index) => {
      if (!agent.name) {
        throw new Error(`Agent ${index}: name is required`)
      }
      
      if (!agent.repo) {
        throw new Error(`Agent "${agent.name}": repo is required`)
      }
      
      if (!agent.tag) {
        throw new Error(`Agent "${agent.name}": tag is required`)
      }
      
      if (!agent.registry_connection) {
        throw new Error(`Agent "${agent.name}": registry_connection is required`)
      }
      
      if (!registryIds.includes(agent.registry_connection)) {
        throw new Error(`Agent "${agent.name}": registry_connection "${agent.registry_connection}" does not exist`)
      }

      // Validate egress allowlist URLs
      agent.egress_allowlist?.forEach((url, urlIndex) => {
        if (!url.match(/^https?:\/\//)) {
          throw new Error(`Agent "${agent.name}": egress_allowlist[${urlIndex}] must be a valid HTTP/HTTPS URL`)
        }
      })
    })
  }

  /**
   * Validate environment variables
   */
  private validateEnvVars(vars: Record<string, string>): void {
    Object.entries(vars).forEach(([key, value]) => {
      // Validate key format (alphanumeric + underscore, starts with letter)
      if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
        throw new Error(`Invalid environment variable name: "${key}". Must be uppercase letters, numbers, and underscores only.`)
      }
      
      // Validate value is a string
      if (typeof value !== 'string') {
        throw new Error(`Environment variable "${key}" must be a string`)
      }
      
      // Warn about potentially problematic characters in values
      if (value.includes('\n') || value.includes('\r')) {
        throw new Error(`Environment variable "${key}" cannot contain newline characters`)
      }
    })
  }
}

// Default instance
export const configRepository = new FileConfigRepository()

// Utility functions for config manipulation
export const configUtils = {
  /**
   * Convert registry form data to config format
   */
  registryFormToConfig: (form: import('@/types/config').RegistryConnectionForm) => ({
    url: form.url,
    enabled: form.enabled,
    auth: {
      method: form.authMethod,
      ...(form.authMethod === 'basic' && {
        username_env: form.usernameEnv,
        password_env: form.passwordEnv
      }),
      ...(form.authMethod === 'token' && {
        token_env: form.tokenEnv
      })
    }
  }),

  /**
   * Convert config format to registry form data
   */
  configToRegistryForm: (id: string, config: import('@/types/config').RegistryConnection): import('@/types/config').RegistryConnectionForm => ({
    id,
    name: id,
    url: config.url,
    enabled: config.enabled,
    authMethod: config.auth.method,
    usernameEnv: config.auth.username_env,
    passwordEnv: config.auth.password_env,
    tokenEnv: config.auth.token_env
  }),

  /**
   * Convert agent form data to config format
   */
  agentFormToConfig: (form: import('@/types/config').AgentConfigForm): import('@/types/config').AgentConfig => ({
    name: form.name,
    repo: form.repo,
    tag: form.tag,
    registry_connection: form.registry_connection,
    ...(form.egressAllowlist && {
      egress_allowlist: form.egressAllowlist.split(',').map(s => s.trim()).filter(Boolean)
    }),
    ...(form.labels && Object.keys(form.labels).length > 0 && {
      labels: form.labels
    }),
    ...(form.artifact_permissions && {
      artifact_permissions: form.artifact_permissions
    }),
    overrides: {
      ...(form.envVariables && Object.keys(form.envVariables).length > 0 && {
        env: form.envVariables
      }),
      ...(form.exposePorts && {
        expose: form.exposePorts.split(',').map(s => s.trim()).filter(Boolean)
      })
    }
  }),

  /**
   * Convert config format to agent form data
   */
  configToAgentForm: (config: import('@/types/config').AgentConfig): import('@/types/config').AgentConfigForm => ({
    id: config.name,
    name: config.name,
    repo: config.repo,
    tag: config.tag,
    registry_connection: config.registry_connection,
    model_dependencies: config.model_dependencies,
    egressAllowlist: config.egress_allowlist?.join(', ') || '',
    labels: config.labels || {},
    artifact_permissions: config.artifact_permissions,
    envVariables: config.overrides?.env || {},
    exposePorts: config.overrides?.expose?.join(', ') || ''
  }),

  /**
   * Convert model form data to config format
   */
  modelFormToConfig: (form: import('@/types/config').ModelConnectionForm): import('@/types/config').ModelConnection => ({
    model_id: form.model_id,
    provider: form.provider,
    enabled: form.enabled,
    provider_model_id: form.provider_model_id,
    ...(form.endpoint && {
      endpoint: form.endpoint
    }),
    auth: {
      method: form.authMethod,
      ...(form.authMethod === 'api_key' && {
        api_key_env: form.apiKeyEnv
      }),
      ...(form.authMethod === 'aws_credentials' && {
        aws_access_key_env: form.awsAccessKeyEnv,
        aws_secret_key_env: form.awsSecretKeyEnv,
        aws_region: form.awsRegion
      }),
      ...(form.authMethod === 'azure_ad' && {
        azure_endpoint: form.azureEndpoint,
        azure_deployment: form.azureDeployment,
        azure_api_version: form.azureApiVersion
      })
    }
  }),

  /**
   * Convert config format to model form data
   */
  configToModelForm: (id: string, config: import('@/types/config').ModelConnection): import('@/types/config').ModelConnectionForm => ({
    id,
    model_id: config.model_id,
    provider: config.provider,
    enabled: config.enabled,
    provider_model_id: config.provider_model_id,
    endpoint: config.endpoint || '',
    authMethod: config.auth.method,
    apiKeyEnv: config.auth.api_key_env || '',
    awsAccessKeyEnv: config.auth.aws_access_key_env || '',
    awsSecretKeyEnv: config.auth.aws_secret_key_env || '',
    awsRegion: config.auth.aws_region || '',
    azureEndpoint: config.auth.azure_endpoint || '',
    azureDeployment: config.auth.azure_deployment || '',
    azureApiVersion: config.auth.azure_api_version || ''
  })
}