import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Test utilities for AgentSystems UI
 */

/**
 * Create a new QueryClient for each test to avoid state pollution
 */
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

/**
 * Custom render function that includes all necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: Omit<CustomRenderOptions, 'initialEntries'> = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

/**
 * Mock agent data for testing
 */
export const mockAgents = [
  {
    name: 'hello-world-agent',
    state: 'running' as const,
  },
  {
    name: 'test-agent',
    state: 'stopped' as const,
  },
  {
    name: 'config-agent',
    state: 'not-created' as const,
  },
]

/**
 * Mock agent metadata
 */
export const mockAgentMetadata = {
  name: 'hello-world-agent',
  version: '1.0.0',
  description: 'A simple hello world agent for testing',
  author: 'AgentSystems',
  tags: ['demo', 'example'],
  capabilities: ['greeting', 'basic-response'],
}

/**
 * Mock invocation response
 */
export const mockInvokeResponse = {
  thread_id: 'test-thread-123',
  status_url: '/status/test-thread-123',
  result_url: '/result/test-thread-123',
}

/**
 * Mock API responses
 */
export const mockApiResponses = {
  agents: { agents: mockAgents },
  metadata: mockAgentMetadata,
  health: { status: 'ok', version: '1.0.0' },
  invoke: mockInvokeResponse,
  status: {
    state: 'completed',
    progress: { percent: 100, message: 'Task completed' },
  },
  result: {
    result: { message: 'Hello, World!' },
  },
}

// Re-export testing library functions for convenience
export { 
  render, 
  screen, 
  waitFor, 
  fireEvent, 
  cleanup,
  renderHook,
  act 
} from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'