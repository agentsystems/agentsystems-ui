/**
 * API-related type definitions for AgentSystems UI
 */

export interface AgentsResponse {
  agents: Array<{
    name: string
    state: 'running' | 'stopped' | 'not-created'
  }>
}

export interface AgentMetadata {
  namespace: string
  name: string
  version: string
  description: string
  model_dependencies: string[]
  // Optional fields that might be present
  author?: string
  tags?: string[]
  capabilities?: string[]
  created_at?: string
  last_updated?: string
}

export interface AgentHealth {
  status: 'ok' | 'error'
  version?: string
  uptime?: number
  lastCheck?: string
}

export interface InvokeRequest {
  sync?: boolean
  [key: string]: unknown
}

export interface InvokeResponse {
  thread_id: string
  status_url: string
  result_url: string
  result?: unknown
}

export interface InvocationStatus {
  thread_id: string
  state: 'queued' | 'running' | 'completed' | 'failed'
  progress?: {
    percent?: number
    message?: string
    current?: string
    steps?: Array<{
      id: string
      label: string
      state: 'pending' | 'running' | 'completed' | 'failed'
    }>
  }
  error?: {
    message: string
    status?: number
    body?: string
  }
}

export interface InvocationResult {
  thread_id: string
  result?: unknown
  error?: {
    message: string
    status?: number
    body?: string
  }
}

export interface ApiError {
  message: string
  code?: string | number
  details?: unknown
}