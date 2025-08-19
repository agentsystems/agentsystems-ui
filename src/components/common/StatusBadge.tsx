/**
 * Unified status badge component for consistent status display across the application
 * 
 * Features:
 * - Consistent styling for agent states (running, stopped, not-created)
 * - Consistent styling for execution states (completed, failed, running, queued)
 * - Theme-aware colors and styling
 * - Accessibility support with proper ARIA labels
 * - Cyber theme special effects (brackets, text effects)
 * 
 * @example
 * ```tsx
 * <StatusBadge type="agent" status="running" />
 * <StatusBadge type="execution" status="completed" />
 * ```
 */

import styles from './StatusBadge.module.css'

type AgentStatus = 'running' | 'stopped' | 'not-created'
type ExecutionStatus = 'completed' | 'failed' | 'running' | 'queued'

interface StatusBadgeProps {
  /** Type of status badge - determines styling and color scheme */
  type: 'agent' | 'execution'
  /** Status value to display */
  status: AgentStatus | ExecutionStatus
  /** Additional CSS classes */
  className?: string
  /** Custom aria-label for accessibility */
  ariaLabel?: string
}

/**
 * Get display text for status values
 */
function getDisplayText(type: string, status: string): string {
  if (type === 'agent') {
    switch (status) {
      case 'running': return 'on'
      case 'stopped': return 'off'
      case 'not-created': return 'off'
      default: return status
    }
  }
  return status // execution statuses display as-is
}

/**
 * Get CSS class for status styling
 */
function getStatusClass(type: string, status: string): string {
  if (type === 'agent') {
    switch (status) {
      case 'running': return styles.agentRunning
      case 'stopped': return styles.agentStopped
      case 'not-created': return styles.agentNotCreated
      default: return styles.agentDefault
    }
  } else {
    switch (status) {
      case 'completed': return styles.executionCompleted
      case 'failed': return styles.executionFailed
      case 'running': return styles.executionRunning
      case 'queued': return styles.executionQueued
      default: return styles.executionDefault
    }
  }
}

/**
 * Get accessible description for screen readers
 */
function getAccessibleDescription(type: string, status: string): string {
  if (type === 'agent') {
    switch (status) {
      case 'running': return 'Agent is currently running and accepting requests'
      case 'stopped': return 'Agent is stopped and not accepting requests'
      case 'not-created': return 'Agent container has not been created yet'
      default: return `Agent status: ${status}`
    }
  } else {
    switch (status) {
      case 'completed': return 'Execution completed successfully'
      case 'failed': return 'Execution failed with an error'
      case 'running': return 'Execution is currently in progress'
      case 'queued': return 'Execution is queued and waiting to start'
      default: return `Execution status: ${status}`
    }
  }
}

export default function StatusBadge({ 
  type, 
  status, 
  className = '', 
  ariaLabel 
}: StatusBadgeProps) {
  const displayText = getDisplayText(type, status)
  const statusClass = getStatusClass(type, status)
  const accessibleDescription = ariaLabel || getAccessibleDescription(type, status)

  return (
    <span 
      className={`${styles.statusBadge} ${statusClass} ${className}`}
      aria-label={accessibleDescription}
      role="status"
    >
      {displayText}
    </span>
  )
}