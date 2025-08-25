/**
 * Model definitions with metadata
 * Currently supporting Claude family of models only
 */

export type ModelVendor = 'anthropic' | 'openai' | 'meta'
export type ModelCategory = 'flagship' | 'fast' | 'reasoning' | 'vision' | 'code' | 'embedding' | 'legacy'
export type ModelCapability = 'text' | 'vision' | 'function_calling' | 'streaming' | 'json_mode'

export interface ModelDefinition {
  id: string  // Standardized model ID
  modelVendor: ModelVendor  // Who created the model (Anthropic, Meta, OpenAI, etc.)
  displayName: string
  description: string
  category: ModelCategory
  capabilities: ModelCapability[]
  contextWindow: number
  maxOutput?: number
  deprecated?: boolean
  releaseDate?: string
  notes?: string
}

// Model definitions - Claude family only for now
export const MODELS: Record<string, ModelDefinition> = {
  // Claude models - Created by Anthropic
  'claude-opus-4.1': {
    id: 'claude-opus-4.1',
    modelVendor: 'anthropic',
    displayName: 'Claude Opus 4.1',
    description: 'Most powerful Claude model with advanced reasoning',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2025-08'
  },
  
  'claude-opus-4': {
    id: 'claude-opus-4',
    modelVendor: 'anthropic',
    displayName: 'Claude Opus 4',
    description: 'Powerful model for complex tasks',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2025-05'
  },
  
  'claude-sonnet-4': {
    id: 'claude-sonnet-4',
    modelVendor: 'anthropic',
    displayName: 'Claude Sonnet 4',
    description: 'Balanced performance and intelligence',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2025-05'
  },
  
  'claude-sonnet-3.7': {
    id: 'claude-sonnet-3.7',
    modelVendor: 'anthropic',
    displayName: 'Claude Sonnet 3.7',
    description: 'Fast and capable for most tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2025-02'
  },
  
  'claude-haiku-3.5': {
    id: 'claude-haiku-3.5',
    modelVendor: 'anthropic',
    displayName: 'Claude Haiku 3.5',
    description: 'Fast and efficient for everyday tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2024-10'
  },
  
  'claude-haiku-3': {
    id: 'claude-haiku-3',
    modelVendor: 'anthropic',
    displayName: 'Claude Haiku 3',
    description: 'Fastest Claude model for simple tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutput: 4096,
    releaseDate: '2024-03'
  },

  // OpenAI models
  'gpt-5': {
    id: 'gpt-5',
    modelVendor: 'openai',
    displayName: 'GPT-5',
    description: 'OpenAI\'s most advanced model with enhanced reasoning capabilities',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 16384,
    releaseDate: '2025-03'
  },

  'gpt-4o': {
    id: 'gpt-4o',
    modelVendor: 'openai',
    displayName: 'GPT-4o',
    description: 'Multimodal flagship model optimized for speed and cost',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 8192,
    releaseDate: '2024-05'
  },

  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    modelVendor: 'openai',
    displayName: 'GPT-4o Mini',
    description: 'Fast and cost-effective model for everyday tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 8192,
    releaseDate: '2024-07'
  },

  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    modelVendor: 'openai',
    displayName: 'GPT-4 Turbo',
    description: 'High-performance model with optimized speed',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-04'
  },

  // Meta models
  'llama-3.1-405b': {
    id: 'llama-3.1-405b',
    modelVendor: 'meta',
    displayName: 'Llama 3.1 405B',
    description: 'Meta\'s largest and most capable model',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },

  'llama-3.1-70b': {
    id: 'llama-3.1-70b',
    modelVendor: 'meta',
    displayName: 'Llama 3.1 70B',
    description: 'High-performance model for complex reasoning tasks',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },

  'llama-3.1-8b': {
    id: 'llama-3.1-8b',
    modelVendor: 'meta',
    displayName: 'Llama 3.1 8B',
    description: 'Efficient model for fast inference and cost-effective deployment',
    category: 'fast',
    capabilities: ['text', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  }
}

// Helper functions
export function getModel(modelId: string): ModelDefinition | undefined {
  return MODELS[modelId]
}

export function getModelsByCategory(category: ModelCategory): ModelDefinition[] {
  return Object.values(MODELS).filter(model => model.category === category)
}

export function getActiveModels(): ModelDefinition[] {
  return Object.values(MODELS).filter(model => !model.deprecated)
}

export function getModelsWithCapability(capability: ModelCapability): ModelDefinition[] {
  return Object.values(MODELS).filter(model => 
    model.capabilities.includes(capability)
  )
}