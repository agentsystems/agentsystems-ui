import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  AgentSystemsConfig, 
  RegistryConnectionForm, 
  AgentConfigForm, 
  EnvVariable
} from '../types/config'
import { configRepository, configUtils } from '../api/configRepository'

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
  
  // Actions
  loadConfig: () => Promise<void>
  saveConfig: () => Promise<void>
  
  // Registry management
  getRegistryConnections: () => RegistryConnectionForm[]
  addRegistryConnection: (registry: Omit<RegistryConnectionForm, 'id'>) => void
  updateRegistryConnection: (id: string, updates: Partial<RegistryConnectionForm>) => void
  deleteRegistryConnection: (id: string) => void
  
  // Agent management  
  getAgents: () => AgentConfigForm[]
  addAgent: (agent: Omit<AgentConfigForm, 'id'>) => void
  updateAgent: (id: string, updates: Partial<AgentConfigForm>) => void
  deleteAgent: (id: string) => void
  
  // Environment variable management
  getEnvVars: () => Array<{ key: string; value: string; isSecret: boolean }>
  setEnvVar: (key: string, value: string) => void
  deleteEnvVar: (key: string) => void
  
  // Utility
  reset: () => void
  getReferencedEnvVars: () => Set<string>
}

const defaultConfig: AgentSystemsConfig = {
  config_version: 1,
  registry_connections: {},
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
          hasUnsavedChanges: true
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
            hasUnsavedChanges: true
          }
        })
      },

      deleteRegistryConnection: (id) => {
        set((state) => {
          const { [id]: deleted, ...remainingConnections } = state.config.registry_connections
          
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
            hasUnsavedChanges: true
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
          hasUnsavedChanges: true
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
            hasUnsavedChanges: true
          }
        })
      },

      deleteAgent: (name) => {
        set((state) => ({
          config: {
            ...state.config,
            agents: state.config.agents.filter(agent => agent.name !== name)
          },
          hasUnsavedChanges: true
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
        set((state) => ({
          envVars: {
            ...state.envVars,
            [key]: value
          },
          hasUnsavedChanges: true
        }))
      },

      deleteEnvVar: (key) => {
        set((state) => {
          const { [key]: deleted, ...remaining } = state.envVars
          return {
            envVars: remaining,
            hasUnsavedChanges: true
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
        
        Object.values(state.config.registry_connections).forEach(connection => {
          if (connection.auth.username_env) referenced.add(connection.auth.username_env)
          if (connection.auth.password_env) referenced.add(connection.auth.password_env)
          if (connection.auth.token_env) referenced.add(connection.auth.token_env)
        })
        
        return referenced
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