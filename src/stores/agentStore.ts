import { create } from 'zustand'

export interface Agent {
  name: string
  state: 'running' | 'stopped' | 'not-created'
  port?: number
  registry?: string
  repo?: string
  tag?: string
  lastActivity?: Date
  metrics?: {
    cpu: number
    memory: number
    requests: number
  }
}

export interface AgentInvocation {
  threadId: string
  agent: string
  state: 'pending' | 'running' | 'completed' | 'failed'
  progress?: {
    percent: number
    message?: string
    steps?: Array<{
      id: string
      label: string
      state: 'pending' | 'running' | 'completed' | 'failed'
    }>
  }
  result?: any
  error?: string
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
}

interface AgentStore {
  agents: Agent[]
  invocations: Map<string, AgentInvocation>
  selectedAgent: Agent | null
  setAgents: (agents: Agent[]) => void
  setSelectedAgent: (agent: Agent | null) => void
  addInvocation: (invocation: AgentInvocation) => void
  updateInvocation: (threadId: string, update: Partial<AgentInvocation>) => void
  getInvocation: (threadId: string) => AgentInvocation | undefined
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  invocations: new Map(),
  selectedAgent: null,
  
  setAgents: (agents) => set({ agents }),
  
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  
  addInvocation: (invocation) => 
    set((state) => {
      const newInvocations = new Map(state.invocations)
      newInvocations.set(invocation.threadId, invocation)
      return { invocations: newInvocations }
    }),
  
  updateInvocation: (threadId, update) =>
    set((state) => {
      const newInvocations = new Map(state.invocations)
      const existing = newInvocations.get(threadId)
      if (existing) {
        newInvocations.set(threadId, { ...existing, ...update })
      }
      return { invocations: newInvocations }
    }),
  
  getInvocation: (threadId) => get().invocations.get(threadId),
}))