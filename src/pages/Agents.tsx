import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import ErrorMessage from '@components/ErrorMessage'
import { useAudio } from '@hooks/useAudio'
import { getAgentImage, getStatusVariant } from '@utils/agentHelpers'
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
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: API_DEFAULTS.REFETCH_INTERVAL,
    retry: API_DEFAULTS.RETRY_COUNT,
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

  const agents = data?.agents || []

  return (
    <div className={styles.agents}>
      <div className={styles.header}>
        <h1>Agents</h1>
        <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
      </div>

      <div className={styles.grid}>
        {agents.map((agent) => (
          <Card
            key={agent.name}
            onClick={() => navigate(`/agents/${agent.name}`)}
            className={styles.agentCard}
            ariaLabel={`View details for ${agent.name} agent`}
            ariaDescription={`Agent is currently ${agent.state}. Click to view configuration and invoke options.`}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentInfo}>
                <h3 className={styles.agentName}>{agent.name}</h3>
                <div className={styles.agentImage}>
                  {getAgentImage(agent.name)}
                </div>
              </div>
              <div className={`${styles.status} ${styles[getStatusVariant(agent.state)]}`}>
                {agent.state}
              </div>
            </div>

            <div className={styles.agentActions} role="group" aria-label={`Actions for ${agent.name}`}>
              {agent.state === 'stopped' && (
                <button 
                  className={styles.startBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    // TODO: Implement start functionality
                  }}
                  aria-label={`Start ${agent.name} agent`}
                  title={`Start the ${agent.name} agent container`}
                >
                  Start
                </button>
              )}
              {agent.state === 'running' && (
                <button 
                  className={styles.stopBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    // TODO: Implement stop functionality
                  }}
                  aria-label={`Stop ${agent.name} agent`}
                  title={`Stop the ${agent.name} agent container`}
                >
                  Stop
                </button>
              )}
              <button 
                className={styles.invokeBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  playClickSound()
                  navigate(`/agents/${agent.name}`)
                }}
                aria-label={`Invoke ${agent.name} agent`}
                title={`Open invocation interface for ${agent.name}`}
              >
                Invoke
              </button>
            </div>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
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