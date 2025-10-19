import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import { useConfigStore } from '@stores/configStore'
import AgentFilters from '@components/agents/AgentFilters'
import AgentGrid from '@components/agents/AgentGrid'
import ErrorMessage from '@components/ErrorMessage'
import Toast from '@components/Toast'
import { useToast } from '@hooks/useToast'
import { useAudio } from '@hooks/useAudio'
import { API_DEFAULTS } from '@constants/app'
import { GlobeAltIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
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
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const [searchParams] = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'stopped'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [operatingAgent, setOperatingAgent] = useState<string | null>(null)
  const { toasts, removeToast, showSuccess, showError } = useToast()

  // Get agent configurations for image/tag information
  const { getAgents } = useConfigStore()
  const agentConfigs = getAgents()

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
    onSuccess: (_, agentName) => {
      showSuccess(`Agent ${agentName} started successfully`)
      setOperatingAgent(null)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      console.error('Failed to start agent:', error)
      setOperatingAgent(null)
      showError(`Failed to start agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const stopMutation = useMutation({
    mutationFn: agentsApi.stopAgent,
    onMutate: (agentName) => {
      setOperatingAgent(agentName)
    },
    onSuccess: (_, agentName) => {
      showSuccess(`Agent ${agentName} stopped successfully`)
      setOperatingAgent(null)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      console.error('Failed to stop agent:', error)
      setOperatingAgent(null)
      showError(`Failed to stop agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading agents...</div>
  }

  if (error) {
    return (
      <div className={styles.agents}>
        <div className={styles.header}>
          <div>
            <h1>Agents</h1>
            <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                playClickSound()
                navigate('/discover')
              }}
              className="btn btn-sm btn-primary"
              title="Discover and install community agents"
            >
              <GlobeAltIcon style={{ width: '1rem', height: '1rem' }} />
              Discover Agents
            </button>
            <button
              onClick={() => {
                playClickSound()
                navigate('/configuration/agent-connections')
              }}
              className="btn btn-sm btn-ghost"
              title="Configure agent deployment connections"
            >
              <WrenchScrewdriverIcon style={{ width: '1rem', height: '1rem' }} />
              Configure Connections
            </button>
          </div>
        </div>
        <ErrorMessage
          message="Failed to load agents. Please check your connection to the AgentSystems gateway."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // Filter agents and enhance with config data (repo, tag, version)
  const filteredAgents = (data?.agents || [])
    .map(agent => {
      // Find matching config for this agent to get real image info
      const config = agentConfigs.find(c => c.name === agent.name)
      return {
        ...agent,
        // Add real image information from config
        repo: config?.repo,
        tag: config?.tag,
        image: config ? `${config.repo}:${config.tag}` : agent.name
      }
    })
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
        <div>
          <h1>Agents</h1>
          <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              playClickSound()
              navigate('/discover')
            }}
            className="btn btn-sm btn-primary"
            title="Discover and install community agents"
          >
            <GlobeAltIcon style={{ width: '1rem', height: '1rem' }} />
            Discover Agents
          </button>
          <button
            onClick={() => {
              playClickSound()
              navigate('/configuration/agent-connections')
            }}
            className="btn btn-sm btn-ghost"
            title="Configure agent deployment connections"
          >
            <WrenchScrewdriverIcon style={{ width: '1rem', height: '1rem' }} />
            Configure Connections
          </button>
        </div>
      </div>

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

      {/* Toast notifications */}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          index={index}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}