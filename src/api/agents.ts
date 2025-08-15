import { api } from './client'
import type {
  AgentsResponse,
  AgentMetadata,
  AgentHealth,
  InvokeRequest,
  InvokeResponse,
  InvocationStatus,
  InvocationResult,
} from '@types/api'

export const agentsApi = {
  // List all agents
  list: () => api.get<AgentsResponse>('/agents'),

  // Get agent metadata
  getMetadata: (agentName: string) => 
    api.get<AgentMetadata>(`/${agentName}/metadata`),

  // Get agent health
  getHealth: (agentName: string) =>
    api.get<AgentHealth>(`/${agentName}/health`),

  // Invoke agent
  invoke: (agentName: string, data: InvokeRequest) =>
    api.post<InvokeResponse>(`/invoke/${agentName}`, data),

  // Get invocation status
  getStatus: (threadId: string) =>
    api.get<InvocationStatus>(`/status/${threadId}`),

  // Get invocation result
  getResult: (threadId: string) =>
    api.get<InvocationResult>(`/result/${threadId}`),

  // Upload files and invoke
  uploadAndInvoke: (agentName: string, formData: FormData) =>
    api.upload<InvokeResponse>(`/invoke/${agentName}`, formData),
}