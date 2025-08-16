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
  name: string
  version: string
  description?: string
  author?: string
  tags?: string[]
  capabilities?: string[]
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
  state: 'pending' | 'running' | 'completed' | 'failed'
  progress?: {
    percent: number
    message?: string
    current?: string
    steps?: Array<{
      id: string
      label: string
      state: 'pending' | 'running' | 'completed' | 'failed'
    }>
  }
}

export interface InvocationResult {
  result?: unknown
  error?: string
  metadata?: Record<string, unknown>
}

export interface ApiError {
  message: string
  code?: string | number
  details?: unknown
}