import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import AgentFilters from '@components/agents/AgentFilters'
import AgentGrid from '@components/agents/AgentGrid'
import ErrorMessage from '@components/ErrorMessage'
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
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
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

  // Calculate counts for filter component
  const runningCount = (data?.agents || []).filter(a => a.state === 'running').length
  const stoppedCount = (data?.agents || []).filter(a => a.state !== 'running').length

  const handleStopAll = () => {
    const runningAgents = (data?.agents || []).filter(a => a.state === 'running')
    runningAgents.forEach(agent => stopMutation.mutate(agent.name))
  }

  return (
    <div className={styles.agents}>
      <div className={styles.header}>
        <h1>Agents</h1>
        <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
        
        <AgentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          filteredCount={filteredAgents.length}
          totalCount={data?.agents.length || 0}
          runningCount={runningCount}
          stoppedCount={stoppedCount}
          onStopAll={handleStopAll}
          isStoppingAll={stopMutation.isPending}
        />
      </div>

      <AgentGrid
        agents={filteredAgents}
        onStartAgent={(agentName) => {
          setOperatingAgent(agentName)
          startMutation.mutate(agentName)
        }}
        onStopAgent={(agentName) => {
          setOperatingAgent(agentName)
          stopMutation.mutate(agentName)
        }}
        operatingAgent={operatingAgent}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  )
}