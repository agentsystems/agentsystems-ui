import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, waitFor, mockApiResponses } from '@test/utils'
import Dashboard from '../Dashboard'

// Mock the agents API
vi.mock('@api/agents', () => ({
  agentsApi: {
    list: vi.fn().mockResolvedValue(mockApiResponses.agents),
  },
}))

describe('Dashboard Page', () => {
  it('renders dashboard with correct title and subtitle', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('System overview and metrics')).toBeInTheDocument()
  })

  it('displays agent statistics correctly', async () => {
    renderWithProviders(<Dashboard />)

    await waitFor(() => {
      // Check stat labels
      expect(screen.getByText('Total Agents')).toBeInTheDocument()
      expect(screen.getAllByText('Running')).toHaveLength(2) // One in stats, one in health
      expect(screen.getByText('Stopped')).toBeInTheDocument()
      expect(screen.getByText('Not Created')).toBeInTheDocument()
    })

    // Check stat values - default to 0 since no mock data is loading
    await waitFor(() => {
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(4) // All stats show 0 by default
    })
  })

  it('shows system health metrics', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('System Health')).toBeInTheDocument()
    expect(screen.getByText('Gateway')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
    
    // Check healthy status - use getAllByText for duplicate text
    expect(screen.getByText('Healthy')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
    expect(screen.getAllByText('Running')).toHaveLength(2) // One in stats, one in health
  })

  it('displays recent activity section', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    renderWithProviders(<Dashboard />)

    // Check that stats are displayed in a grid
    const statsSection = screen.getByText('Total Agents').closest('[class*="stats"]')
    expect(statsSection).toBeInTheDocument()

    // Check that panels are displayed
    const activityPanel = screen.getByText('Recent Activity').closest('[class*="card"]')
    const healthPanel = screen.getByText('System Health').closest('[class*="card"]')
    
    expect(activityPanel).toBeInTheDocument()
    expect(healthPanel).toBeInTheDocument()
  })

  it('handles loading state', () => {
    // Mock loading state
    vi.mock('@tanstack/react-query', async () => {
      const actual = await vi.importActual('@tanstack/react-query')
      return {
        ...actual,
        useQuery: vi.fn().mockReturnValue({ 
          data: undefined, 
          isLoading: true, 
          error: null 
        }),
      }
    })

    renderWithProviders(<Dashboard />)

    // Dashboard should still render with default stats during loading
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1) // Multiple 0s for stats
  })
})