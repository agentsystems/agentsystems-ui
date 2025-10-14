import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AgentSystemsConfig,
  RegistryConnectionForm,
  IndexConnectionForm,
  AgentConfigForm,
  ModelConnectionForm
} from '../types/config'
import { configRepository, configUtils } from '@api/configRepository'

interface ConfigState {
  // Core data
  config: AgentSystemsConfig
  envVars: Record<string, string>
  
  // UI state
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  restartRequired: boolean
  changesSinceRestart: string[]
  
  // Actions
  loadConfig: () => Promise<void>
  saveConfig: () => Promise<void>
  
  // Registry management
  getRegistryConnections: () => RegistryConnectionForm[]
  addRegistryConnection: (registry: Omit<RegistryConnectionForm, 'id'>) => void
  updateRegistryConnection: (id: string, updates: Partial<RegistryConnectionForm>) => void
  deleteRegistryConnection: (id: string) => void

  // Index connection management
  getIndexConnections: () => IndexConnectionForm[]
  addIndexConnection: (index: Omit<IndexConnectionForm, 'id'>) => void
  updateIndexConnection: (id: string, updates: Partial<IndexConnectionForm>) => void
  deleteIndexConnection: (id: string) => void

  // Model connection management
  getModelConnections: () => ModelConnectionForm[]
  addModelConnection: (model: Omit<ModelConnectionForm, 'id'>) => void
  updateModelConnection: (id: string, updates: Partial<ModelConnectionForm>) => void
  deleteModelConnection: (id: string) => void
  
  // Agent management  
  getAgents: () => AgentConfigForm[]
  addAgent: (agent: Omit<AgentConfigForm, 'id'>) => void
  updateAgent: (id: string, updates: Partial<AgentConfigForm>) => void
  deleteAgent: (id: string) => void
  
  // Environment variable management
  getEnvVars: () => Array<{ key: string; value: string; isSecret: boolean }>
  setEnvVar: (key: string, value: string) => void
  deleteEnvVar: (key: string) => void
  
  // Restart management
  markRestartRequired: (changeDescription: string) => void
  clearRestartRequired: () => void
  
  // Utility
  reset: () => void
  getReferencedEnvVars: () => Set<string>
  getReferencedRegistries: () => Set<string>
  getRegistryUsage: () => Map<string, string[]>
}

const defaultConfig: AgentSystemsConfig = {
  config_version: 1,
  registry_connections: {},
  index_connections: {},
  model_connections: {},
  agents: []
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Initial state
      config: defaultConfig,
      envVars: {},
      isLoading: false,
      isSaving: false,
      error: null,
      lastSaved: null,
      hasUnsavedChanges: false,
      restartRequired: false,
      changesSinceRestart: [],

      // Load configuration from files
      loadConfig: async () => {
        set({ isLoading: true, error: null })
        try {
          const [config, envVars] = await Promise.all([
            configRepository.readConfig(),
            configRepository.readEnvVars()
          ])
          
          set({ 
            config, 
            envVars, 
            isLoading: false, 
            hasUnsavedChanges: false,
            lastSaved: new Date()
          })
        } catch (error) {
          set({ 
            error: `Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isLoading: false 
          })
        }
      },

      // Save configuration to files
      saveConfig: async () => {
        const state = get()
        set({ isSaving: true, error: null })
        
        try {
          await Promise.all([
            configRepository.writeConfig(state.config),
            configRepository.writeEnvVars(state.envVars)
          ])
          
          set({ 
            isSaving: false, 
            hasUnsavedChanges: false,
            lastSaved: new Date()
          })
        } catch (error) {
          set({ 
            error: `Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isSaving: false 
          })
          throw error
        }
      },

      // Registry connection management
      getRegistryConnections: () => {
        const state = get()
        return Object.entries(state.config.registry_connections).map(([id, connection]) =>
          configUtils.configToRegistryForm(id, connection)
        )
      },

      addRegistryConnection: (registry) => {
        const id = registry.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
        const connection = configUtils.registryFormToConfig({ ...registry, id })
        
        set((state) => ({
          config: {
            ...state.config,
            registry_connections: {
              ...state.config.registry_connections,
              [id]: connection
            }
          },
          hasUnsavedChanges: true,
          restartRequired: true,
          changesSinceRestart: [...state.changesSinceRestart, `Added registry: ${registry.name}`]
        }))
      },

      updateRegistryConnection: (id, updates) => {
        set((state) => {
          const existing = state.config.registry_connections[id]
          if (!existing) return state

          const currentForm = configUtils.configToRegistryForm(id, existing)
          const updatedForm = { ...currentForm, ...updates }
          const updatedConnection = configUtils.registryFormToConfig(updatedForm)

          return {
            config: {
              ...state.config,
              registry_connections: {
                ...state.config.registry_connections,
                [id]: updatedConnection
              }
            },
            hasUnsavedChanges: true,
            restartRequired: true,
            changesSinceRestart: [...state.changesSinceRestart, `Updated registry: ${id}`]
          }
        })
      },

      deleteRegistryConnection: (id) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...remainingConnections } = state.config.registry_connections

          // Remove agents that use this registry connection
          const filteredAgents = state.config.agents.filter(
            agent => agent.registry_connection !== id
          )

          return {
            config: {
              ...state.config,
              registry_connections: remainingConnections,
              agents: filteredAgents
            },
            hasUnsavedChanges: true,
            restartRequired: true,
            changesSinceRestart: [...state.changesSinceRestart, `Deleted registry: ${id}`]
          }
        })
      },

      // Index connection management
      getIndexConnections: () => {
        const state = get()
        if (!state.config.index_connections) return []

        return Object.entries(state.config.index_connections).map(([id, connection]) =>
          configUtils.configToIndexForm(id, connection)
        )
      },

      addIndexConnection: (index) => {
        const id = index.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
        const connection = configUtils.indexFormToConfig({ ...index, id })

        set((state) => ({
          config: {
            ...state.config,
            index_connections: {
              ...state.config.index_connections,
              [id]: connection
            }
          },
          hasUnsavedChanges: true
        }))
      },

      updateIndexConnection: (id, updates) => {
        set((state) => {
          const existing = state.config.index_connections?.[id]
          if (!existing) return state

          const currentForm = configUtils.configToIndexForm(id, existing)
          const updatedForm = { ...currentForm, ...updates }
          const updatedConnection = configUtils.indexFormToConfig(updatedForm)

          return {
            config: {
              ...state.config,
              index_connections: {
                ...state.config.index_connections,
                [id]: updatedConnection
              }
            },
            hasUnsavedChanges: true
          }
        })
      },

      deleteIndexConnection: (id) => {
        set((state) => {
          if (!state.config.index_connections) return state

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...remainingConnections } = state.config.index_connections

          return {
            config: {
              ...state.config,
              index_connections: remainingConnections
            },
            hasUnsavedChanges: true
          }
        })
      },

      // Model connection management
      getModelConnections: () => {
        const state = get()
        if (!state.config.model_connections) return []
        
        return Object.entries(state.config.model_connections).map(([id, connection]) =>
          configUtils.configToModelForm(id, connection)
        )
      },

      addModelConnection: (model) => {
        // Use model_id directly as the key to preserve standard naming (claude-sonnet-4)
        const connection = configUtils.modelFormToConfig({ ...model, id: model.model_id })
        
        set((state) => ({
          config: {
            ...state.config,
            model_connections: {
              ...state.config.model_connections,
              [model.model_id]: connection
            }
          },
          hasUnsavedChanges: true,
          restartRequired: true,
          changesSinceRestart: [...state.changesSinceRestart, `Added model connection: ${model.model_id}`]
        }))
      },

      updateModelConnection: (id, updates) => {
        set((state) => {
          const existing = state.config.model_connections?.[id]
          if (!existing) return state

          const currentForm = configUtils.configToModelForm(id, existing)
          const updatedForm = { ...currentForm, ...updates }
          const updatedConnection = configUtils.modelFormToConfig(updatedForm)

          return {
            config: {
              ...state.config,
              model_connections: {
                ...state.config.model_connections,
                [id]: updatedConnection
              }
            },
            hasUnsavedChanges: true,
            restartRequired: true,
            changesSinceRestart: [...state.changesSinceRestart, `Updated model connection: ${id}`]
          }
        })
      },

      deleteModelConnection: (id) => {
        set((state) => {
          if (!state.config.model_connections) return state
          
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...remainingConnections } = state.config.model_connections
          
          return {
            config: {
              ...state.config,
              model_connections: remainingConnections
            },
            hasUnsavedChanges: true,
            restartRequired: true,
            changesSinceRestart: [...state.changesSinceRestart, `Deleted model connection: ${id}`]
          }
        })
      },

      // Agent management
      getAgents: () => {
        const state = get()
        return state.config.agents.map(configUtils.configToAgentForm)
      },

      addAgent: (agent) => {
        const agentConfig = configUtils.agentFormToConfig({ ...agent, id: agent.name })
        
        set((state) => ({
          config: {
            ...state.config,
            agents: [...state.config.agents, agentConfig]
          },
          hasUnsavedChanges: true,
          restartRequired: true,
          changesSinceRestart: [...state.changesSinceRestart, `Added agent: ${agent.name}`]
        }))
      },

      updateAgent: (name, updates) => {
        set((state) => {
          const agentIndex = state.config.agents.findIndex(a => a.name === name)
          if (agentIndex === -1) return state

          const existingAgent = state.config.agents[agentIndex]
          const currentForm = configUtils.configToAgentForm(existingAgent)
          const updatedForm = { ...currentForm, ...updates }
          const updatedAgent = configUtils.agentFormToConfig(updatedForm)

          const newAgents = [...state.config.agents]
          newAgents[agentIndex] = updatedAgent

          return {
            config: {
              ...state.config,
              agents: newAgents
            },
            hasUnsavedChanges: true,
            restartRequired: true,
            changesSinceRestart: [...state.changesSinceRestart, `Updated agent: ${name}`]
          }
        })
      },

      deleteAgent: (name) => {
        set((state) => ({
          config: {
            ...state.config,
            agents: state.config.agents.filter(agent => agent.name !== name)
          },
          hasUnsavedChanges: true,
          restartRequired: true,
          changesSinceRestart: [...state.changesSinceRestart, `Deleted agent: ${name}`]
        }))
      },

      // Environment variable management
      getEnvVars: () => {
        const state = get()
        return Object.entries(state.envVars).map(([key, value]) => ({
          key,
          value,
          isSecret: key.toLowerCase().includes('token') || 
                   key.toLowerCase().includes('password') || 
                   key.toLowerCase().includes('key')
        }))
      },

      setEnvVar: (key, value) => {
        set((state) => {
          // Determine if this env var change requires restart
          const requiresRestart = key.includes('TOKEN') || key.includes('KEY') || key.includes('PASSWORD') ||
                                 key.includes('URL') || key.includes('HOST') || key.includes('API')
          
          return {
            envVars: {
              ...state.envVars,
              [key]: value
            },
            hasUnsavedChanges: true,
            ...(requiresRestart && {
              restartRequired: true,
              changesSinceRestart: [...state.changesSinceRestart, `Updated credential: ${key}`]
            })
          }
        })
      },

      deleteEnvVar: (key) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...remaining } = state.envVars
          
          // Determine if this env var deletion requires restart
          const requiresRestart = key.includes('TOKEN') || key.includes('KEY') || key.includes('PASSWORD') ||
                                 key.includes('URL') || key.includes('HOST') || key.includes('API')
          
          return {
            envVars: remaining,
            hasUnsavedChanges: true,
            ...(requiresRestart && {
              restartRequired: true,
              changesSinceRestart: [...state.changesSinceRestart, `Deleted credential: ${key}`]
            })
          }
        })
      },

      // Utility functions
      reset: () => {
        set({
          config: defaultConfig,
          envVars: {},
          hasUnsavedChanges: false,
          lastSaved: null,
          error: null
        })
      },

      getReferencedEnvVars: () => {
        const state = get()
        const referenced = new Set<string>()
        
        // Registry connection env vars
        Object.values(state.config.registry_connections).forEach(connection => {
          if (connection.auth.username_env) referenced.add(connection.auth.username_env)
          if (connection.auth.password_env) referenced.add(connection.auth.password_env)
          if (connection.auth.token_env) referenced.add(connection.auth.token_env)
        })
        
        // Model connection env vars
        if (state.config.model_connections) {
          Object.values(state.config.model_connections).forEach(connection => {
            if (connection.auth.api_key_env) referenced.add(connection.auth.api_key_env)
            if (connection.auth.aws_access_key_env) referenced.add(connection.auth.aws_access_key_env)
            if (connection.auth.aws_secret_key_env) referenced.add(connection.auth.aws_secret_key_env)
          })
        }
        
        return referenced
      },

      getReferencedRegistries: () => {
        const state = get()
        const referenced = new Set<string>()
        
        state.config.agents.forEach(agent => {
          if (agent.registry_connection) {
            referenced.add(agent.registry_connection)
          }
        })
        
        return referenced
      },

      getRegistryUsage: () => {
        const state = get()
        const usage = new Map<string, string[]>()
        
        state.config.agents.forEach(agent => {
          if (agent.registry_connection) {
            if (!usage.has(agent.registry_connection)) {
              usage.set(agent.registry_connection, [])
            }
            usage.get(agent.registry_connection)!.push(agent.name)
          }
        })
        
        return usage
      },

      // Restart management functions
      markRestartRequired: (changeDescription) => {
        set((state) => ({
          restartRequired: true,
          changesSinceRestart: [...state.changesSinceRestart, changeDescription]
        }))
      },

      clearRestartRequired: () => {
        set({
          restartRequired: false,
          changesSinceRestart: []
        })
      }
    }),
    {
      name: 'agentsystems-config-store',
      partialize: (state) => ({
        config: state.config,
        envVars: state.envVars,
        lastSaved: state.lastSaved
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.lastSaved && typeof state.lastSaved === 'string') {
          state.lastSaved = new Date(state.lastSaved)
        }
      }
    }
  )
)