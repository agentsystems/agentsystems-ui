/**
 * Agent grid component displaying filtered agents in a responsive grid layout
 * 
 * Features:
 * - Responsive grid layout (auto-fill with minimum card width)
 * - Empty state handling with helpful messages
 * - Loading state display
 * - Error state with retry functionality
 * - Agent operation state management
 * - Accessibility with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <AgentGrid
 *   agents={filteredAgents}
 *   onStartAgent={handleStartAgent}
 *   onStopAgent={handleStopAgent}
 *   operatingAgent={operatingAgent}
 *   searchQuery={searchQuery}
 *   onClearSearch={() => setSearchQuery('')}
 * />
 * ```
 */

import AgentCard from './AgentCard'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import styles from './AgentGrid.module.css'

interface Agent {
  name: string
  state: 'running' | 'stopped' | 'not-created'
}

interface AgentGridProps {
  /** Filtered list of agents to display */
  agents: Agent[]
  /** Callback when an agent should be started */
  onStartAgent: (agentName: string) => void
  /** Callback when an agent should be stopped */
  onStopAgent: (agentName: string) => void
  /** Name of agent currently being operated on */
  operatingAgent?: string | null
  /** Current search query for empty state messaging */
  searchQuery?: string
  /** Callback to clear search when no results found */
  onClearSearch?: () => void
  /** Whether data is currently loading */
  isLoading?: boolean
  /** Error state */
  error?: Error | null
  /** Callback to retry on error */
  onRetry?: () => void
}

export default function AgentGrid({
  agents,
  onStartAgent,
  onStopAgent,
  operatingAgent = null,
  searchQuery = '',
  onClearSearch,
  isLoading = false,
  error = null,
  onRetry,
}: AgentGridProps) {
  const { playClickSound } = useAudio()

  if (isLoading) {
    return (
      <div className={styles.loading} role="status" aria-label="Loading agents">
        Loading agents...
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>Failed to load agents</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="btn btn-sm btn-bright"
            aria-label="Retry loading agents"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className={styles.emptyState}>
        <div className={styles.emptyIcon}>🤖</div>
        <h3>No agents found</h3>
        <p className={styles.emptyHint}>
          {searchQuery
            ? `No agents match "${searchQuery}". Try a different search term or check your filter settings.`
            : `Try selecting "All Agents" to see all available agents`
          }
        </p>
        {searchQuery && onClearSearch && (
          <button 
            onClick={() => {
              onClearSearch()
              playClickSound()
            }}
            className={`btn btn-sm btn-bright ${styles.clearFilters}`}
          >
            Clear Search
          </button>
        )}
      </Card>
    )
  }

  return (
    <div className={styles.grid} role="grid" aria-label={`${agents.length} agents`}>
      {agents.map(agent => (
        <AgentCard
          key={agent.name}
          agent={agent}
          onStart={() => onStartAgent(agent.name)}
          onStop={() => onStopAgent(agent.name)}
          isOperating={operatingAgent === agent.name}
        />
      ))}
    </div>
  )
}