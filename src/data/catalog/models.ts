/**
 * Model definitions with metadata
 */

export type ModelCategory = 'flagship' | 'fast' | 'reasoning' | 'vision' | 'code' | 'embedding' | 'legacy'
export type ModelCapability = 'text' | 'vision' | 'function_calling' | 'streaming' | 'json_mode'

export interface ModelDefinition {
  id: string  // Standardized model ID
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

// Model definitions - organized by provider family
export const MODELS: Record<string, ModelDefinition> = {
  // Anthropic Claude models
  'claude-3.5-sonnet': {
    id: 'claude-3.5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    description: 'Most intelligent model with advanced reasoning',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2024-10'
  },
  
  'claude-3.5-haiku': {
    id: 'claude-3.5-haiku',
    displayName: 'Claude 3.5 Haiku',
    description: 'Fast and efficient for everyday tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 200000,
    maxOutput: 8192,
    releaseDate: '2024-11'
  },
  
  'claude-3-opus': {
    id: 'claude-3-opus',
    displayName: 'Claude 3 Opus',
    description: 'Powerful model for complex tasks',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutput: 4096,
    releaseDate: '2024-03'
  },
  
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    displayName: 'Claude 3 Sonnet',
    description: 'Balanced performance and intelligence',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutput: 4096,
    releaseDate: '2024-03'
  },
  
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    displayName: 'Claude 3 Haiku',
    description: 'Fastest Claude model for simple tasks',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutput: 4096,
    releaseDate: '2024-03'
  },
  
  // OpenAI GPT models
  'gpt-4o': {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    description: 'Multimodal flagship model',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 16384,
    releaseDate: '2024-05'
  },
  
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    description: 'Affordable small model with vision',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 16384,
    releaseDate: '2024-07'
  },
  
  'o1': {
    id: 'o1',
    displayName: 'OpenAI o1',
    description: 'Reasoning model for complex problems',
    category: 'reasoning',
    capabilities: ['text'],
    contextWindow: 200000,
    maxOutput: 100000,
    releaseDate: '2024-12'
  },
  
  'o1-mini': {
    id: 'o1-mini',
    displayName: 'OpenAI o1-mini',
    description: 'Faster reasoning model',
    category: 'reasoning',
    capabilities: ['text'],
    contextWindow: 128000,
    maxOutput: 65536,
    releaseDate: '2024-09'
  },
  
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    description: 'Previous generation flagship',
    category: 'legacy',
    capabilities: ['text', 'vision', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-04'
  },
  
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    description: 'Legacy fast model',
    category: 'legacy',
    capabilities: ['text', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 16385,
    maxOutput: 4096,
    deprecated: true
  },
  
  // Google models
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    displayName: 'Gemini 2.0 Flash',
    description: 'Experimental multimodal model',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 1000000,
    maxOutput: 8192,
    releaseDate: '2024-12'
  },
  
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    description: 'Advanced model with massive context',
    category: 'flagship',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 2000000,
    maxOutput: 8192,
    releaseDate: '2024-05'
  },
  
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    description: 'Fast multimodal model',
    category: 'fast',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 1000000,
    maxOutput: 8192,
    releaseDate: '2024-05'
  },
  
  // Meta Llama models
  'llama-3.3-70b': {
    id: 'llama-3.3-70b',
    displayName: 'Llama 3.3 70B',
    description: 'Latest open-weight flagship model',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-12'
  },
  
  'llama-3.2-90b': {
    id: 'llama-3.2-90b',
    displayName: 'Llama 3.2 90B',
    description: 'Multimodal vision-language model',
    category: 'flagship',
    capabilities: ['text', 'vision', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-09'
  },
  
  'llama-3.2-11b': {
    id: 'llama-3.2-11b',
    displayName: 'Llama 3.2 11B',
    description: 'Efficient vision-language model',
    category: 'fast',
    capabilities: ['text', 'vision', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-09'
  },
  
  'llama-3.1-405b': {
    id: 'llama-3.1-405b',
    displayName: 'Llama 3.1 405B',
    description: 'Largest open-weight model',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },
  
  'llama-3.1-70b': {
    id: 'llama-3.1-70b',
    displayName: 'Llama 3.1 70B',
    description: 'Efficient large model',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },
  
  'llama-3.1-8b': {
    id: 'llama-3.1-8b',
    displayName: 'Llama 3.1 8B',
    description: 'Lightweight model for edge deployment',
    category: 'fast',
    capabilities: ['text', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },
  
  // Mistral models
  'mistral-large': {
    id: 'mistral-large',
    displayName: 'Mistral Large',
    description: 'Flagship model with function calling',
    category: 'flagship',
    capabilities: ['text', 'function_calling', 'streaming', 'json_mode'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-07'
  },
  
  'mistral-medium': {
    id: 'mistral-medium',
    displayName: 'Mistral Medium',
    description: 'Balanced model for general use',
    category: 'fast',
    capabilities: ['text', 'streaming'],
    contextWindow: 32000,
    maxOutput: 4096,
    deprecated: true
  },
  
  'mixtral-8x7b': {
    id: 'mixtral-8x7b',
    displayName: 'Mixtral 8x7B',
    description: 'MoE model with good performance',
    category: 'fast',
    capabilities: ['text', 'streaming', 'json_mode'],
    contextWindow: 32000,
    maxOutput: 4096,
    releaseDate: '2023-12'
  },
  
  // Code models
  'codestral': {
    id: 'codestral',
    displayName: 'Codestral',
    description: 'Specialized model for code generation',
    category: 'code',
    capabilities: ['text', 'streaming'],
    contextWindow: 32000,
    maxOutput: 4096,
    releaseDate: '2024-05'
  },
  
  'deepseek-coder-v2': {
    id: 'deepseek-coder-v2',
    displayName: 'DeepSeek Coder V2',
    description: 'Advanced code generation model',
    category: 'code',
    capabilities: ['text', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-06'
  },
  
  'qwen-2.5-coder-32b': {
    id: 'qwen-2.5-coder-32b',
    displayName: 'Qwen 2.5 Coder 32B',
    description: 'Powerful code model from Alibaba',
    category: 'code',
    capabilities: ['text', 'streaming'],
    contextWindow: 128000,
    maxOutput: 4096,
    releaseDate: '2024-11'
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