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

/**
 * API client for AgentSystems agent management and invocation
 * 
 * Provides high-level functions for interacting with the AgentSystems
 * control plane to manage agents and execute tasks.
 */
export const agentsApi = {
  /**
   * List all discovered agents and their current states
   * @returns Promise<AgentsResponse> List of agents with names and states
   */
  list: () => api.get<AgentsResponse>('/agents'),

  /**
   * Get detailed metadata for a specific agent
   * @param agentName - Name of the agent to query
   * @returns Promise<AgentMetadata> Agent details including version, description, capabilities
   */
  getMetadata: (agentName: string) => 
    api.get<AgentMetadata>(`/${agentName}/metadata`),

  /**
   * Check the health status of a specific agent
   * @param agentName - Name of the agent to check
   * @returns Promise<AgentHealth> Current health status and uptime info
   */
  getHealth: (agentName: string) =>
    api.get<AgentHealth>(`/${agentName}/health`),

  /**
   * Invoke an agent with a JSON payload
   * @param agentName - Name of the agent to invoke
   * @param data - JSON payload to send to the agent
   * @returns Promise<InvokeResponse> Thread ID and status URLs for tracking
   */
  invoke: (agentName: string, data: InvokeRequest) =>
    api.post<InvokeResponse>(`/invoke/${agentName}`, data),

  /**
   * Get the current status of an agent invocation
   * @param threadId - Thread ID returned from invoke()
   * @returns Promise<InvocationStatus> Current state and progress information
   */
  getStatus: (threadId: string) =>
    api.get<InvocationStatus>(`/status/${threadId}`),

  /**
   * Get the final result of a completed agent invocation
   * @param threadId - Thread ID returned from invoke()
   * @returns Promise<InvocationResult> Final result data or error information
   */
  getResult: (threadId: string) =>
    api.get<InvocationResult>(`/result/${threadId}`),

  /**
   * Upload files and invoke an agent with multipart form data
   * @param agentName - Name of the agent to invoke
   * @param formData - FormData containing files and JSON payload
   * @returns Promise<InvokeResponse> Thread ID and status URLs for tracking
   */
  uploadAndInvoke: (agentName: string, formData: FormData) =>
    api.upload<InvokeResponse>(`/invoke/${agentName}`, formData),
}