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

// Execution-related types
export interface Execution {
  thread_id: string
  agent: string
  user_token: string
  state: 'queued' | 'running' | 'completed' | 'failed'
  created_at: string
  started_at?: string
  ended_at?: string
  payload?: unknown
  result?: unknown
  error?: unknown
  progress?: unknown
}

export interface ExecutionsResponse {
  executions: Execution[]
  pagination?: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
  total?: number
}

export interface HealthResponse {
  status: 'ok' | 'error'
  agents?: string[]
  version?: string
}

// Artifacts-related types
export interface ArtifactFile {
  name: string
  path: string
  size: number
  modified: string
  type: 'in' | 'out'
}

export interface ArtifactsResponse {
  thread_id: string
  input_files: ArtifactFile[]
  output_files: ArtifactFile[]
}

// Audit-related types
export interface AuditEntry {
  id: string
  timestamp: string
  user_token: string
  actor: string
  action: string
  resource: string
  status_code: number
  payload?: unknown
  error_msg?: string
  prev_hash?: string
  entry_hash?: string
}

export interface AuditResponse {
  thread_id: string
  input_payload?: unknown
  audit_trail: AuditEntry[]
}

export interface IntegrityCheckResponse {
  verified: boolean
  total_entries: number
  compromised_count: number
  compromised_entries: Array<{
    thread_id: string
    timestamp: string
    action: string
    error: string
  }>
}

// Logs-related types
export interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  source: string
  extra?: Record<string, unknown>
}

export interface LogsResponse {
  logs: LogEntry[]
  total: number
  offset: number
  limit: number
  has_more: boolean
}