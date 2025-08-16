import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen, waitFor, userEvent, mockApiResponses } from '@test/utils'
import Agents from '../Agents'

// Mock the agents API
vi.mock('@api/agents', () => ({
  agentsApi: {
    list: vi.fn().mockResolvedValue(mockApiResponses.agents),
  },
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Agents Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders agents list successfully', async () => {
    renderWithProviders(<Agents />)

    // Wait for agents to load first
    await waitFor(() => {
      expect(screen.getByText('hello-world-agent')).toBeInTheDocument()
    })

    // Then check page structure
    expect(screen.getByText('Agents')).toBeInTheDocument()
    expect(screen.getByText('Manage and monitor your deployed agents')).toBeInTheDocument()
    expect(screen.getByText('test-agent')).toBeInTheDocument()
    expect(screen.getByText('config-agent')).toBeInTheDocument()
  })

  it('displays correct agent states', async () => {
    renderWithProviders(<Agents />)

    await waitFor(() => {
      // Check status badges
      expect(screen.getByText('running')).toBeInTheDocument()
      expect(screen.getByText('stopped')).toBeInTheDocument()
      expect(screen.getByText('not-created')).toBeInTheDocument()
    })
  })

  it('shows appropriate action buttons based on agent state', async () => {
    renderWithProviders(<Agents />)

    await waitFor(() => {
      // Running agent should have Stop and Invoke buttons
      const runningCard = screen.getByText('hello-world-agent').closest('[role="button"]')
      expect(runningCard).toBeInTheDocument()

      // Stopped agent should have Start and Invoke buttons
      expect(screen.getByText('Start')).toBeInTheDocument()
      
      // All agents should have Invoke button
      expect(screen.getAllByText('Invoke')).toHaveLength(3)
    })
  })

  it('navigates to agent detail when card is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Agents />)

    await waitFor(() => {
      const agentCard = screen.getByLabelText('View details for hello-world-agent agent')
      expect(agentCard).toBeInTheDocument()
    })

    const agentCard = screen.getByLabelText('View details for hello-world-agent agent')
    await user.click(agentCard)

    expect(mockNavigate).toHaveBeenCalledWith('/agents/hello-world-agent')
  })

  it('displays loading state initially', () => {
    renderWithProviders(<Agents />)
    expect(screen.getByText('Loading agents...')).toBeInTheDocument()
  })

  it('handles accessibility attributes correctly', async () => {
    renderWithProviders(<Agents />)

    await waitFor(() => {
      const agentCard = screen.getByLabelText('View details for hello-world-agent agent')
      expect(agentCard).toHaveAttribute('role', 'button')
      expect(agentCard).toHaveAttribute('tabIndex', '0')
    })
  })
})