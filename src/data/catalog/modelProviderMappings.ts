/**
 * Mappings between models and providers
 * Defines which providers offer which models and their provider-specific IDs
 */

export interface ProviderModelMapping {
  modelId: string  // Standardized model ID
  providerId: string  // Provider ID
  providerModelId: string  // Provider-specific model identifier
  notes?: string  // Any special notes about this availability
}

// Model to provider mappings
// Organized by model for easy lookup
export const MODEL_PROVIDER_MAPPINGS: ProviderModelMapping[] = [
  // Claude models - Anthropic
  {
    modelId: 'claude-3.5-sonnet',
    providerId: 'anthropic',
    providerModelId: 'claude-3-5-sonnet-20241022'
  },
  {
    modelId: 'claude-3.5-haiku',
    providerId: 'anthropic',
    providerModelId: 'claude-3-5-haiku-20241022'
  },
  {
    modelId: 'claude-3-opus',
    providerId: 'anthropic',
    providerModelId: 'claude-3-opus-20240229'
  },
  {
    modelId: 'claude-3-sonnet',
    providerId: 'anthropic',
    providerModelId: 'claude-3-sonnet-20240229'
  },
  {
    modelId: 'claude-3-haiku',
    providerId: 'anthropic',
    providerModelId: 'claude-3-haiku-20240307'
  },
  
  // Claude models - AWS Bedrock
  {
    modelId: 'claude-3.5-sonnet',
    providerId: 'aws_bedrock',
    providerModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0'
  },
  {
    modelId: 'claude-3.5-haiku',
    providerId: 'aws_bedrock',
    providerModelId: 'anthropic.claude-3-5-haiku-20241022-v1:0'
  },
  {
    modelId: 'claude-3-opus',
    providerId: 'aws_bedrock',
    providerModelId: 'anthropic.claude-3-opus-20240229-v1:0'
  },
  {
    modelId: 'claude-3-sonnet',
    providerId: 'aws_bedrock',
    providerModelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
  },
  {
    modelId: 'claude-3-haiku',
    providerId: 'aws_bedrock',
    providerModelId: 'anthropic.claude-3-haiku-20240307-v1:0'
  },
  
  // Claude models - GCP Vertex
  {
    modelId: 'claude-3.5-sonnet',
    providerId: 'gcp_vertex',
    providerModelId: 'claude-3-5-sonnet-v2@20241022'
  },
  {
    modelId: 'claude-3.5-haiku',
    providerId: 'gcp_vertex',
    providerModelId: 'claude-3-5-haiku@20241022'
  },
  {
    modelId: 'claude-3-opus',
    providerId: 'gcp_vertex',
    providerModelId: 'claude-3-opus@20240229'
  },
  {
    modelId: 'claude-3-sonnet',
    providerId: 'gcp_vertex',
    providerModelId: 'claude-3-sonnet@20240229'
  },
  {
    modelId: 'claude-3-haiku',
    providerId: 'gcp_vertex',
    providerModelId: 'claude-3-haiku@20240307'
  },
  
  // GPT models - OpenAI
  {
    modelId: 'gpt-4o',
    providerId: 'openai',
    providerModelId: 'gpt-4o-2024-11-20'
  },
  {
    modelId: 'gpt-4o-mini',
    providerId: 'openai',
    providerModelId: 'gpt-4o-mini'
  },
  {
    modelId: 'o1',
    providerId: 'openai',
    providerModelId: 'o1'
  },
  {
    modelId: 'o1-mini',
    providerId: 'openai',
    providerModelId: 'o1-mini'
  },
  {
    modelId: 'gpt-4-turbo',
    providerId: 'openai',
    providerModelId: 'gpt-4-turbo-2024-04-09'
  },
  {
    modelId: 'gpt-3.5-turbo',
    providerId: 'openai',
    providerModelId: 'gpt-3.5-turbo-0125'
  },
  
  // GPT models - Azure OpenAI (deployment names are user-defined)
  {
    modelId: 'gpt-4o',
    providerId: 'azure_openai',
    providerModelId: 'gpt-4o',
    notes: 'Actual deployment name is user-defined in Azure'
  },
  {
    modelId: 'gpt-4o-mini',
    providerId: 'azure_openai',
    providerModelId: 'gpt-4o-mini',
    notes: 'Actual deployment name is user-defined in Azure'
  },
  {
    modelId: 'gpt-4-turbo',
    providerId: 'azure_openai',
    providerModelId: 'gpt-4-turbo',
    notes: 'Actual deployment name is user-defined in Azure'
  },
  
  // Gemini models - GCP Vertex
  {
    modelId: 'gemini-2.0-flash',
    providerId: 'gcp_vertex',
    providerModelId: 'gemini-2.0-flash-exp'
  },
  {
    modelId: 'gemini-1.5-pro',
    providerId: 'gcp_vertex',
    providerModelId: 'gemini-1.5-pro-002'
  },
  {
    modelId: 'gemini-1.5-flash',
    providerId: 'gcp_vertex',
    providerModelId: 'gemini-1.5-flash-002'
  },
  
  // Llama models - AWS Bedrock
  {
    modelId: 'llama-3.2-90b',
    providerId: 'aws_bedrock',
    providerModelId: 'meta.llama3-2-90b-instruct-v1:0'
  },
  {
    modelId: 'llama-3.2-11b',
    providerId: 'aws_bedrock',
    providerModelId: 'meta.llama3-2-11b-instruct-v1:0'
  },
  {
    modelId: 'llama-3.1-405b',
    providerId: 'aws_bedrock',
    providerModelId: 'meta.llama3-1-405b-instruct-v1:0'
  },
  {
    modelId: 'llama-3.1-70b',
    providerId: 'aws_bedrock',
    providerModelId: 'meta.llama3-1-70b-instruct-v1:0'
  },
  {
    modelId: 'llama-3.1-8b',
    providerId: 'aws_bedrock',
    providerModelId: 'meta.llama3-1-8b-instruct-v1:0'
  },
  
  // Llama models - Together AI
  {
    modelId: 'llama-3.3-70b',
    providerId: 'together',
    providerModelId: 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
  },
  {
    modelId: 'llama-3.2-90b',
    providerId: 'together',
    providerModelId: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo'
  },
  {
    modelId: 'llama-3.2-11b',
    providerId: 'together',
    providerModelId: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo'
  },
  {
    modelId: 'llama-3.1-405b',
    providerId: 'together',
    providerModelId: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
  },
  {
    modelId: 'llama-3.1-70b',
    providerId: 'together',
    providerModelId: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
  },
  {
    modelId: 'llama-3.1-8b',
    providerId: 'together',
    providerModelId: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
  },
  
  // Llama models - Groq
  {
    modelId: 'llama-3.3-70b',
    providerId: 'groq',
    providerModelId: 'llama-3.3-70b-versatile'
  },
  {
    modelId: 'llama-3.2-90b',
    providerId: 'groq',
    providerModelId: 'llama-3.2-90b-vision-preview'
  },
  {
    modelId: 'llama-3.2-11b',
    providerId: 'groq',
    providerModelId: 'llama-3.2-11b-vision-preview'
  },
  {
    modelId: 'llama-3.1-70b',
    providerId: 'groq',
    providerModelId: 'llama-3.1-70b-versatile'
  },
  {
    modelId: 'llama-3.1-8b',
    providerId: 'groq',
    providerModelId: 'llama-3.1-8b-instant'
  },
  
  // Llama models - Replicate
  {
    modelId: 'llama-3.1-405b',
    providerId: 'replicate',
    providerModelId: 'meta/meta-llama-3.1-405b-instruct'
  },
  {
    modelId: 'llama-3.1-70b',
    providerId: 'replicate',
    providerModelId: 'meta/meta-llama-3-70b-instruct'
  },
  {
    modelId: 'llama-3.1-8b',
    providerId: 'replicate',
    providerModelId: 'meta/meta-llama-3-8b-instruct'
  },
  
  // Llama models - Ollama (local)
  {
    modelId: 'llama-3.1-70b',
    providerId: 'ollama',
    providerModelId: 'llama3.1:70b'
  },
  {
    modelId: 'llama-3.1-8b',
    providerId: 'ollama',
    providerModelId: 'llama3.1:8b'
  },
  
  // Mistral models - Mistral AI
  {
    modelId: 'mistral-large',
    providerId: 'mistral',
    providerModelId: 'mistral-large-latest'
  },
  {
    modelId: 'mixtral-8x7b',
    providerId: 'mistral',
    providerModelId: 'open-mixtral-8x7b'
  },
  {
    modelId: 'codestral',
    providerId: 'mistral',
    providerModelId: 'codestral-latest'
  },
  
  // Mistral models - AWS Bedrock
  {
    modelId: 'mistral-large',
    providerId: 'aws_bedrock',
    providerModelId: 'mistral.mistral-large-2407-v1:0'
  },
  {
    modelId: 'mixtral-8x7b',
    providerId: 'aws_bedrock',
    providerModelId: 'mistral.mixtral-8x7b-instruct-v0:1'
  },
  
  // Mistral models - Together AI
  {
    modelId: 'mixtral-8x7b',
    providerId: 'together',
    providerModelId: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
  },
  
  // Mistral models - Groq
  {
    modelId: 'mixtral-8x7b',
    providerId: 'groq',
    providerModelId: 'mixtral-8x7b-32768'
  },
  
  // Mistral models - Ollama
  {
    modelId: 'mistral-large',
    providerId: 'ollama',
    providerModelId: 'mistral-large'
  },
  {
    modelId: 'mixtral-8x7b',
    providerId: 'ollama',
    providerModelId: 'mixtral:8x7b'
  },
  
  // Code models - Together AI
  {
    modelId: 'deepseek-coder-v2',
    providerId: 'together',
    providerModelId: 'deepseek-ai/DeepSeek-V2.5'
  },
  {
    modelId: 'qwen-2.5-coder-32b',
    providerId: 'together',
    providerModelId: 'Qwen/Qwen2.5-Coder-32B-Instruct'
  },
  {
    modelId: 'codestral',
    providerId: 'together',
    providerModelId: 'mistralai/Codestral-22B-v0.1'
  },
  
  // Code models - Ollama
  {
    modelId: 'deepseek-coder-v2',
    providerId: 'ollama',
    providerModelId: 'deepseek-coder-v2:236b'
  },
  {
    modelId: 'qwen-2.5-coder-32b',
    providerId: 'ollama',
    providerModelId: 'qwen2.5-coder:32b'
  },
  {
    modelId: 'codestral',
    providerId: 'ollama',
    providerModelId: 'codestral:22b'
  }
]

// Helper functions for efficient lookups
export function getProvidersForModel(modelId: string): string[] {
  return [...new Set(
    MODEL_PROVIDER_MAPPINGS
      .filter(mapping => mapping.modelId === modelId)
      .map(mapping => mapping.providerId)
  )]
}

export function getProviderModelId(modelId: string, providerId: string): string | undefined {
  const mapping = MODEL_PROVIDER_MAPPINGS.find(
    m => m.modelId === modelId && m.providerId === providerId
  )
  return mapping?.providerModelId
}

export function getModelsForProvider(providerId: string): string[] {
  return [...new Set(
    MODEL_PROVIDER_MAPPINGS
      .filter(mapping => mapping.providerId === providerId)
      .map(mapping => mapping.modelId)
  )]
}

export function isModelAvailableOnProvider(modelId: string, providerId: string): boolean {
  return MODEL_PROVIDER_MAPPINGS.some(
    m => m.modelId === modelId && m.providerId === providerId
  )
}