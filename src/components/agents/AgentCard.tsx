/**
 * Individual agent card component displaying agent information and actions
 * 
 * Features:
 * - Agent metadata display (name, version, image)
 * - Real-time status indicator with StatusBadge
 * - Action buttons (start/stop/view) with proper states
 * - Click-to-navigate to agent detail page
 * - Loading states for ongoing operations
 * - Accessibility with comprehensive ARIA labels
 * - Audio feedback for interactions
 * - Cyber theme visual effects
 * 
 * @example
 * ```tsx
 * <AgentCard
 *   agent={agent}
 *   onStart={() => startAgent(agent.name)}
 *   onStop={() => stopAgent(agent.name)}
 *   onView={() => navigate(`/agents/${agent.name}`)}
 *   isOperating={operatingAgent === agent.name}
 * />
 * ```
 */

import { useNavigate } from 'react-router-dom'
import Card from '@components/common/Card'
import StatusBadge from '@components/common/StatusBadge'
import { PowerIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useAudio } from '@hooks/useAudio'
import { getAgentButtonText } from '@utils/agentHelpers'
import styles from './AgentCard.module.css'

interface Agent {
  name: string
  state: 'running' | 'stopped' | 'not-created'
  repo?: string
  tag?: string
  image?: string
}

interface AgentCardProps {
  /** Agent data to display */
  agent: Agent
  /** Callback when start button is clicked */
  onStart: () => void
  /** Callback when stop button is clicked */
  onStop: () => void
  /** Whether this agent is currently being operated on (start/stop) */
  isOperating?: boolean
  /** Additional CSS classes */
  className?: string
}

export default function AgentCard({
  agent,
  onStart,
  onStop,
  isOperating = false,
  className = '',
}: AgentCardProps) {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()

  const handleCardClick = () => {
    playClickSound()
    navigate(`/agents/${agent.name}`)
  }

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation() // Prevent card click
    playClickSound()
    action()
  }

  return (
    <Card
      onClick={handleCardClick}
      className={`${styles.agentCard} ${className}`}
      ariaLabel={`View details for ${agent.name} agent`}
      ariaDescription={`Agent is currently ${agent.state}. Click to view configuration and invoke options.`}
      role="button"
      tabIndex={0}
    >
      <div className={styles.agentHeader}>
        <div className={styles.agentInfo}>
          <h3 className={styles.agentName} title={agent.name}>
            {agent.name.length > 23 ? `${agent.name.substring(0, 23)}..` : agent.name}
          </h3>
          <div className={styles.agentVersion}>
            {agent.tag || 'latest'}
          </div>
          <div className={styles.agentImage}>
            {agent.image || agent.name}
          </div>
        </div>
        <StatusBadge 
          type="agent" 
          status={agent.state}
          className={styles.statusBadge}
        />
      </div>

      <div className={styles.agentActions} role="group" aria-label={`Actions for ${agent.name}`}>
        {agent.state === 'stopped' || agent.state === 'not-created' ? (
          <button 
            className="btn btn-sm btn-subtle btn-success-color"
            onClick={(e) => handleActionClick(e, onStart)}
            disabled={isOperating}
            aria-label={`Start ${agent.name} agent`}
            title={`Start the ${agent.name} agent container`}
          >
            <PowerIcon />
            {isOperating ? 'Turning On...' : getAgentButtonText(agent.state)}
          </button>
        ) : (
          <button 
            className="btn btn-sm btn-subtle btn-danger-color"
            onClick={(e) => handleActionClick(e, onStop)}
            disabled={isOperating}
            aria-label={`Stop ${agent.name} agent`}
            title={`Stop the ${agent.name} agent container`}
          >
            <PowerIcon />
            {isOperating ? 'Turning Off...' : getAgentButtonText(agent.state)}
          </button>
        )}
        
        <button 
          className="btn btn-sm btn-subtle"
          onClick={(e) => handleActionClick(e, () => navigate(`/agents/${agent.name}`))}
          aria-label={`View ${agent.name} agent`}
          title={`Open ${agent.name} agent page`}
        >
          <EyeIcon />
          View
        </button>
      </div>
    </Card>
  )
}