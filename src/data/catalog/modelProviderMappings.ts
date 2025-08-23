/**
 * Mappings between models and hosting providers
 * Maps which hosting providers can serve which models, with provider-specific model IDs
 */

export interface ModelHostingMapping {
  modelId: string  // Standardized model ID
  hostingProviderId: string  // Hosting Provider ID (anthropic, aws_bedrock, gcp_vertex)
  hostingProviderModelId: string  // Provider-specific model identifier
  notes?: string  // Any special notes about this availability
}

// Model to hosting provider mappings with exact IDs from the table
export const MODEL_HOSTING_MAPPINGS: ModelHostingMapping[] = [
  // Claude Opus 4.1
  {
    modelId: 'claude-opus-4.1',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-opus-4-1-20250805'
  },
  {
    modelId: 'claude-opus-4.1',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-opus-4-1-20250805-v1:0'
  },
  {
    modelId: 'claude-opus-4.1',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-opus-4-1@20250805'
  },
  
  // Claude Opus 4
  {
    modelId: 'claude-opus-4',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-opus-4-20250514'
  },
  {
    modelId: 'claude-opus-4',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-opus-4-20250514-v1:0'
  },
  {
    modelId: 'claude-opus-4',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-opus-4@20250514'
  },
  
  // Claude Sonnet 4
  {
    modelId: 'claude-sonnet-4',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-sonnet-4-20250514'
  },
  {
    modelId: 'claude-sonnet-4',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-sonnet-4-20250514-v1:0'
  },
  {
    modelId: 'claude-sonnet-4',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-sonnet-4@20250514'
  },
  
  // Claude Sonnet 3.7
  {
    modelId: 'claude-sonnet-3.7',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-3-7-sonnet-20250219',
    notes: 'Also available as claude-3-7-sonnet-latest'
  },
  {
    modelId: 'claude-sonnet-3.7',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-3-7-sonnet-20250219-v1:0'
  },
  {
    modelId: 'claude-sonnet-3.7',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-3-7-sonnet@20250219'
  },
  
  // Claude Haiku 3.5
  {
    modelId: 'claude-haiku-3.5',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-3-5-haiku-20241022',
    notes: 'Also available as claude-3-5-haiku-latest'
  },
  {
    modelId: 'claude-haiku-3.5',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-3-5-haiku-20241022-v1:0'
  },
  {
    modelId: 'claude-haiku-3.5',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-3-5-haiku@20241022'
  },
  
  // Claude Haiku 3
  {
    modelId: 'claude-haiku-3',
    hostingProviderId: 'anthropic',
    hostingProviderModelId: 'claude-3-haiku-20240307'
  },
  {
    modelId: 'claude-haiku-3',
    hostingProviderId: 'aws_bedrock',
    hostingProviderModelId: 'anthropic.claude-3-haiku-20240307-v1:0'
  },
  {
    modelId: 'claude-haiku-3',
    hostingProviderId: 'gcp_vertex',
    hostingProviderModelId: 'claude-3-haiku@20240307'
  }
]

// Helper functions for efficient lookups
export function getHostingProvidersForModel(modelId: string): string[] {
  return [...new Set(
    MODEL_HOSTING_MAPPINGS
      .filter(mapping => mapping.modelId === modelId)
      .map(mapping => mapping.hostingProviderId)
  )]
}

export function getHostingProviderModelId(modelId: string, hostingProviderId: string): string | undefined {
  const mapping = MODEL_HOSTING_MAPPINGS.find(
    m => m.modelId === modelId && m.hostingProviderId === hostingProviderId
  )
  return mapping?.hostingProviderModelId
}

export function getModelsForHostingProvider(hostingProviderId: string): string[] {
  return [...new Set(
    MODEL_HOSTING_MAPPINGS
      .filter(mapping => mapping.hostingProviderId === hostingProviderId)
      .map(mapping => mapping.modelId)
  )]
}

export function isModelAvailableOnHostingProvider(modelId: string, hostingProviderId: string): boolean {
  return MODEL_HOSTING_MAPPINGS.some(
    m => m.modelId === modelId && m.hostingProviderId === hostingProviderId
  )
}