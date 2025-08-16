import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import ErrorMessage from '@components/ErrorMessage'
import { useAudio } from '@hooks/useAudio'
import { getAgentImage, getStatusVariant, getAgentVersion, getAgentDisplayState, getAgentButtonText } from '@utils/agentHelpers'
import { API_DEFAULTS } from '@constants/app'
import styles from './Agents.module.css'

/**
 * Agents page component - displays all discovered agents in a grid layout
 * 
 * Features:
 * - Real-time agent discovery (auto-refreshes every 5 seconds)
 * - Agent status indicators (running, stopped, not-created)
 * - Interactive agent cards with hover effects
 * - Action buttons for start/stop/invoke operations
 * - Error handling with retry functionality
 * - Loading states with spinner
 * - Cyber theme audio feedback
 * - Repository/image information display
 * 
 * The page connects to the AgentSystems control plane to discover
 * agents via Docker labels and displays their current operational status.
 */
export default function Agents() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'stopped'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [operatingAgent, setOperatingAgent] = useState<string | null>(null)

  // Initialize filter from URL parameter
  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam && ['all', 'running', 'stopped'].includes(filterParam)) {
      setSelectedFilter(filterParam as 'all' | 'running' | 'stopped')
    }
  }, [searchParams])
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: API_DEFAULTS.REFETCH_INTERVAL,
    retry: API_DEFAULTS.RETRY_COUNT,
  })

  const startMutation = useMutation({
    mutationFn: agentsApi.startAgent,
    onMutate: (agentName) => {
      setOperatingAgent(agentName)
    },
    onSuccess: (data) => {
      console.log('Agent started:', data.message)
      setOperatingAgent(null)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      console.error('Failed to start agent:', error)
      setOperatingAgent(null)
      alert(`Failed to start agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const stopMutation = useMutation({
    mutationFn: agentsApi.stopAgent,
    onMutate: (agentName) => {
      setOperatingAgent(agentName)
    },
    onSuccess: (data) => {
      console.log('Agent stopped:', data.message)
      setOperatingAgent(null)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      console.error('Failed to stop agent:', error)
      setOperatingAgent(null)
      alert(`Failed to stop agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading agents...</div>
  }

  if (error) {
    return (
      <div className={styles.agents}>
        <div className={styles.header}>
          <h1>Agents</h1>
          <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
        </div>
        <ErrorMessage 
          message="Failed to load agents. Please check your connection to the AgentSystems gateway."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // Filter agents based on selected filter and search query
  const filteredAgents = (data?.agents || [])
    .filter(agent => {
      // State filter
      if (selectedFilter === 'running') return agent.state === 'running'
      if (selectedFilter === 'stopped') return agent.state === 'stopped' || agent.state === 'not-created'
      return true // 'all'
    })
    .filter(agent => {
      // Search filter
      if (!searchQuery.trim()) return true
      return agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

  return (
    <div className={styles.agents}>
      <div className={styles.header}>
        <h1>Agents</h1>
        <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
        
        <div className={styles.filterControls}>
          <div className={styles.searchGroup}>
            <label htmlFor="agent-search">Search agents:</label>
            <div className={styles.searchInputWrapper}>
              <input
                id="agent-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type agent name..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    playClickSound()
                  }}
                  className={styles.clearSearch}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="agent-filter">Filter by state:</label>
            <select 
              id="agent-filter"
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value as 'all' | 'running' | 'stopped')
                playClickSound()
                e.target.blur() // Remove focus after selection
              }}
              className={styles.filterSelect}
            >
              <option value="all">All ({data?.agents.length || 0})</option>
              <option value="running">On ({(data?.agents || []).filter(a => a.state === 'running').length})</option>
              <option value="stopped">Off ({(data?.agents || []).filter(a => a.state !== 'running').length})</option>
            </select>
          </div>
          
          <span className={styles.resultCount}>
            Showing {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
          </span>
          
          {(data?.agents || []).some(a => a.state === 'running') && (
            <button
              className="btn btn-sm btn-subtle"
              onClick={() => {
                playClickSound()
                const runningAgents = (data?.agents || []).filter(a => a.state === 'running')
                runningAgents.forEach(agent => stopMutation.mutate(agent.name))
              }}
              disabled={stopMutation.isPending}
            >
              Turn Off All
            </button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredAgents.map((agent) => (
          <Card
            key={agent.name}
            onClick={() => navigate(`/agents/${agent.name}`)}
            className={styles.agentCard}
            ariaLabel={`View details for ${agent.name} agent`}
            ariaDescription={`Agent is currently ${agent.state}. Click to view configuration and invoke options.`}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentInfo}>
                <h3 className={styles.agentName} title={agent.name}>
                  {agent.name.length > 18 ? `${agent.name.substring(0, 18)}...` : agent.name}
                </h3>
                <div className={styles.agentVersion}>
                  {getAgentVersion(agent.name)}
                </div>
                <div className={styles.agentImage}>
                  {getAgentImage(agent.name)}
                </div>
              </div>
              <div className={`${styles.status} ${styles[getStatusVariant(agent.state)]}`}>
                {getAgentDisplayState(agent.state)}
              </div>
            </div>

            <div className={styles.agentActions} role="group" aria-label={`Actions for ${agent.name}`}>
              {agent.state === 'stopped' && (
                <button 
                  className="btn btn-sm btn-subtle"
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    startMutation.mutate(agent.name)
                  }}
                  disabled={operatingAgent === agent.name}
                  aria-label={`Start ${agent.name} agent`}
                  title={`Start the ${agent.name} agent container`}
                >
                  {operatingAgent === agent.name ? 'Turning On...' : getAgentButtonText(agent.state)}
                </button>
              )}
              {agent.state === 'running' && (
                <button 
                  className="btn btn-sm btn-subtle"
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    stopMutation.mutate(agent.name)
                  }}
                  disabled={operatingAgent === agent.name}
                  aria-label={`Stop ${agent.name} agent`}
                  title={`Stop the ${agent.name} agent container`}
                >
                  {operatingAgent === agent.name ? 'Turning Off...' : getAgentButtonText(agent.state)}
                </button>
              )}
              <button 
                className="btn btn-sm btn-subtle"
                onClick={(e) => {
                  e.stopPropagation()
                  playClickSound()
                  navigate(`/agents/${agent.name}`)
                }}
                aria-label={`View ${agent.name} agent`}
                title={`Open ${agent.name} agent page`}
              >
                View
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (data?.agents || []).length > 0 && (
        <Card className={styles.emptyState}>
          <p>No agents match the current {searchQuery ? 'search and filter' : 'filter'}</p>
          <p className={styles.emptyHint}>
            {searchQuery 
              ? `Try clearing the search or changing the filter`
              : `Try selecting "All Agents" to see all available agents`
            }
          </p>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('')
                playClickSound()
              }}
              className={styles.clearFiltersBtn}
            >
              Clear Search
            </button>
          )}
        </Card>
      )}

      {(data?.agents || []).length === 0 && (
        <Card className={styles.emptyState}>
          <p>No agents found</p>
          <p className={styles.emptyHint}>
            Deploy agents using the AgentSystems SDK
          </p>
        </Card>
      )}
    </div>
  )
}