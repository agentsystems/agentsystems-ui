import { api } from './client'
import type { Agent, AgentInvocation } from '@stores/agentStore'

export interface AgentsResponse {
  agents: Array<{
    name: string
    state: 'running' | 'stopped' | 'not-created'
  }>
}

export interface InvokeRequest {
  sync?: boolean
  [key: string]: any
}

export interface InvokeResponse {
  thread_id: string
  status_url: string
  result_url: string
  result?: any
}

export interface StatusResponse {
  state: 'pending' | 'running' | 'completed' | 'failed'
  progress?: {
    percent: number
    message?: string
    current?: string
    steps?: Array<{
      id: string
      label: string
      state: string
    }>
  }
}

export interface ResultResponse {
  result?: any
  error?: string
}

export const agentsApi = {
  // List all agents
  list: () => api.get<AgentsResponse>('/agents'),

  // Get agent metadata
  getMetadata: (agentName: string) => 
    api.get(`/${agentName}/metadata`),

  // Get agent health
  getHealth: (agentName: string) =>
    api.get(`/${agentName}/health`),

  // Invoke agent
  invoke: (agentName: string, data: InvokeRequest) =>
    api.post<InvokeResponse>(`/invoke/${agentName}`, data),

  // Get invocation status
  getStatus: (threadId: string) =>
    api.get<StatusResponse>(`/status/${threadId}`),

  // Get invocation result
  getResult: (threadId: string) =>
    api.get<ResultResponse>(`/result/${threadId}`),

  // Upload files and invoke
  uploadAndInvoke: (agentName: string, formData: FormData) =>
    api.upload<InvokeResponse>(`/invoke/${agentName}`, formData),
}