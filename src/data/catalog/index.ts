/**
 * Main entry point for the model catalog system
 * Combines models, hosting providers, and mappings into a unified API
 */

export * from './models'
export * from './providers'
export * from './modelProviderMappings'

import { MODELS, ModelDefinition, getModel, ModelVendor } from './models'
import { HOSTING_PROVIDERS, HostingProviderConfig, getHostingProvider } from './providers'
import { 
  MODEL_HOSTING_MAPPINGS,
  getHostingProvidersForModel as getMappedProviders,
  getHostingProviderModelId as getMappedModelId,
  getModelsForHostingProvider as getMappedModels
} from './modelProviderMappings'

// Combined hosting provider info with available models
export interface HostingProviderWithModels {
  hostingProvider: HostingProviderConfig
  availableModels: ModelDefinition[]
}

// Model with available hosting providers
export interface ModelWithHostingProviders {
  model: ModelDefinition
  hostingProviders: Array<{
    hostingProvider: HostingProviderConfig
    hostingProviderModelId: string
    notes?: string
  }>
}

/**
 * Get all model IDs in the catalog
 */
export function getAllModelIds(): string[] {
  return Object.keys(MODELS).sort()
}

/**
 * Get all hosting provider IDs in the catalog
 */
export function getAllHostingProviderIds(): string[] {
  return Object.keys(HOSTING_PROVIDERS).sort()
}

/**
 * Get model with all its available hosting providers
 */
export function getModelWithHostingProviders(modelId: string): ModelWithHostingProviders | undefined {
  const model = getModel(modelId)
  if (!model) return undefined
  
  const hostingProviderIds = getMappedProviders(modelId)
  const hostingProviders = hostingProviderIds.map(hostingProviderId => {
    const hostingProvider = getHostingProvider(hostingProviderId)
    const hostingProviderModelId = getMappedModelId(modelId, hostingProviderId)
    const mapping = MODEL_HOSTING_MAPPINGS.find(
      m => m.modelId === modelId && m.hostingProviderId === hostingProviderId
    )
    
    return {
      hostingProvider: hostingProvider!,
      hostingProviderModelId: hostingProviderModelId!,
      notes: mapping?.notes
    }
  }).filter(p => p.hostingProvider)
  
  return { model, hostingProviders }
}

/**
 * Get hosting provider with all its available models
 */
export function getHostingProviderWithModels(hostingProviderId: string): HostingProviderWithModels | undefined {
  const hostingProvider = getHostingProvider(hostingProviderId)
  if (!hostingProvider) return undefined
  
  const modelIds = getMappedModels(hostingProviderId)
  const availableModels = modelIds
    .map(modelId => getModel(modelId))
    .filter((model): model is ModelDefinition => model !== undefined)
  
  return { hostingProvider, availableModels }
}

/**
 * Get hosting providers for a model with full hosting provider configs
 */
export function getHostingProvidersForModel(modelId: string): HostingProviderConfig[] {
  const hostingProviderIds = getMappedProviders(modelId)
  return hostingProviderIds
    .map(id => getHostingProvider(id))
    .filter((provider): provider is HostingProviderConfig => provider !== undefined)
}

/**
 * Get the hosting provider-specific model ID
 */
export function getHostingProviderModelId(modelId: string, hostingProviderId: string): string | undefined {
  return getMappedModelId(modelId, hostingProviderId)
}

/**
 * Search models by name or description
 */
export function searchModels(query: string): ModelDefinition[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(MODELS).filter(model => 
    model.id.toLowerCase().includes(lowerQuery) ||
    model.displayName.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get all models grouped by category
 */
export function getModelsGroupedByCategory(): Record<string, ModelDefinition[]> {
  const grouped: Record<string, ModelDefinition[]> = {}
  
  Object.values(MODELS).forEach(model => {
    if (!grouped[model.category]) {
      grouped[model.category] = []
    }
    grouped[model.category].push(model)
  })
  
  return grouped
}

/**
 * Get all models grouped by vendor
 */
export function getModelsGroupedByVendor(): Record<ModelVendor, ModelDefinition[]> {
  const grouped: Partial<Record<ModelVendor, ModelDefinition[]>> = {}
  
  Object.values(MODELS).forEach(model => {
    if (!grouped[model.modelVendor]) {
      grouped[model.modelVendor] = []
    }
    grouped[model.modelVendor]!.push(model)
  })
  
  return grouped as Record<ModelVendor, ModelDefinition[]>
}

/**
 * Get all hosting providers grouped by their primary auth method
 */
export function getHostingProvidersGroupedByAuth(): Record<string, HostingProviderConfig[]> {
  const grouped: Record<string, HostingProviderConfig[]> = {}
  
  Object.values(HOSTING_PROVIDERS).forEach(provider => {
    const authMethod = provider.defaultAuthMethod
    if (!grouped[authMethod]) {
      grouped[authMethod] = []
    }
    grouped[authMethod].push(provider)
  })
  
  return grouped
}

/**
 * Validate a model connection configuration
 */
export function validateModelConnection(
  modelId: string, 
  hostingProviderId: string
): { valid: boolean; error?: string } {
  const model = getModel(modelId)
  if (!model) {
    return { valid: false, error: `Model ${modelId} not found` }
  }
  
  const hostingProvider = getHostingProvider(hostingProviderId)
  if (!hostingProvider) {
    return { valid: false, error: `Hosting provider ${hostingProviderId} not found` }
  }
  
  const hostingProviderModelId = getMappedModelId(modelId, hostingProviderId)
  if (!hostingProviderModelId) {
    return { 
      valid: false, 
      error: `Model ${model.displayName} is not available on ${hostingProvider.displayName}` 
    }
  }
  
  return { valid: true }
}

// Re-export with clearer names for compatibility
export {
  getHostingProvidersForModel as getProvidersForModel,
  getHostingProviderModelId as getProviderModelId,
  getHostingProvider as getProvider,
  type HostingProviderConfig as ProviderConfig
}