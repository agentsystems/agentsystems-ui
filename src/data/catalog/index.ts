/**
 * Main entry point for the model catalog system
 * Combines models, providers, and mappings into a unified API
 */

export * from './models'
export * from './providers'
export * from './modelProviderMappings'

import { MODELS, ModelDefinition, getModel } from './models'
import { PROVIDERS, ProviderConfig, getProvider } from './providers'
import { 
  MODEL_PROVIDER_MAPPINGS,
  getProvidersForModel as getMappedProviders,
  getProviderModelId as getMappedModelId,
  getModelsForProvider as getMappedModels
} from './modelProviderMappings'

// Combined provider info with available models
export interface ProviderWithModels {
  provider: ProviderConfig
  availableModels: ModelDefinition[]
}

// Model with available providers
export interface ModelWithProviders {
  model: ModelDefinition
  providers: Array<{
    provider: ProviderConfig
    providerModelId: string
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
 * Get all provider IDs in the catalog
 */
export function getAllProviderIds(): string[] {
  return Object.keys(PROVIDERS).sort()
}

/**
 * Get model with all its available providers
 */
export function getModelWithProviders(modelId: string): ModelWithProviders | undefined {
  const model = getModel(modelId)
  if (!model) return undefined
  
  const providerIds = getMappedProviders(modelId)
  const providers = providerIds.map(providerId => {
    const provider = getProvider(providerId)
    const providerModelId = getMappedModelId(modelId, providerId)
    const mapping = MODEL_PROVIDER_MAPPINGS.find(
      m => m.modelId === modelId && m.providerId === providerId
    )
    
    return {
      provider: provider!,
      providerModelId: providerModelId!,
      notes: mapping?.notes
    }
  }).filter(p => p.provider)
  
  return { model, providers }
}

/**
 * Get provider with all its available models
 */
export function getProviderWithModels(providerId: string): ProviderWithModels | undefined {
  const provider = getProvider(providerId)
  if (!provider) return undefined
  
  const modelIds = getMappedModels(providerId)
  const availableModels = modelIds
    .map(modelId => getModel(modelId))
    .filter((model): model is ModelDefinition => model !== undefined)
  
  return { provider, availableModels }
}

/**
 * Get providers for a model with full provider configs
 */
export function getProvidersForModel(modelId: string): ProviderConfig[] {
  const providerIds = getMappedProviders(modelId)
  return providerIds
    .map(id => getProvider(id))
    .filter((provider): provider is ProviderConfig => provider !== undefined)
}

/**
 * Get the provider-specific model ID
 */
export function getProviderModelId(modelId: string, providerId: string): string | undefined {
  return getMappedModelId(modelId, providerId)
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
 * Get all providers grouped by their primary auth method
 */
export function getProvidersGroupedByAuth(): Record<string, ProviderConfig[]> {
  const grouped: Record<string, ProviderConfig[]> = {}
  
  Object.values(PROVIDERS).forEach(provider => {
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
  providerId: string
): { valid: boolean; error?: string } {
  const model = getModel(modelId)
  if (!model) {
    return { valid: false, error: `Model ${modelId} not found` }
  }
  
  const provider = getProvider(providerId)
  if (!provider) {
    return { valid: false, error: `Provider ${providerId} not found` }
  }
  
  const providerModelId = getMappedModelId(modelId, providerId)
  if (!providerModelId) {
    return { 
      valid: false, 
      error: `Model ${model.displayName} is not available on ${provider.displayName}` 
    }
  }
  
  return { valid: true }
}