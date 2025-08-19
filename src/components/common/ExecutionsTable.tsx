/**
 * Shared executions table component for displaying execution history
 * 
 * Features:
 * - Configurable column display (responsive layouts)
 * - Status indicators with StatusBadge component
 * - Click-to-navigate to execution details
 * - Keyboard navigation support
 * - Real-time updates with live regions
 * - Duration calculations and formatting
 * - Empty state handling
 * - Accessibility with proper table semantics
 * 
 * Used by:
 * - Dashboard (Recent Executions - 5 rows)
 * - AgentDetail (Full execution history)
 * - Executions page (Full table with all columns)
 * 
 * @example
 * ```tsx
 * <ExecutionsTable
 *   executions={executionsData.executions}
 *   variant="compact"
 *   maxRows={5}
 *   onRowClick={(threadId) => navigate(`/executions?thread=${threadId}`)}
 * />
 * ```
 */

import { format, differenceInMilliseconds } from 'date-fns'
import StatusBadge from '@components/common/StatusBadge'
import { useAudio } from '@hooks/useAudio'
import styles from './ExecutionsTable.module.css'

interface Execution {
  thread_id: string
  agent: string
  state: 'completed' | 'failed' | 'running' | 'queued'
  created_at: string
  started_at?: string
  ended_at?: string
}

interface ExecutionsTableProps {
  /** Array of executions to display */
  executions: Execution[]
  /** Table variant for different layouts */
  variant?: 'full' | 'compact' | 'minimal'
  /** Maximum number of rows to display (for compact views) */
  maxRows?: number
  /** Callback when a row is clicked */
  onRowClick?: (threadId: string) => void
  /** Whether table should show loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Additional CSS classes */
  className?: string
  /** Function to format duration values */
  formatDuration?: (ms: number) => string
}

/**
 * Default duration formatter
 */
const defaultFormatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

/**
 * Get columns to display based on variant
 */
function getColumns(variant: string) {
  switch (variant) {
    case 'minimal':
      return ['agent', 'status']
    case 'compact':
      return ['agent', 'status', 'started', 'duration']
    case 'full':
    default:
      return ['agent', 'status', 'thread', 'started', 'duration']
  }
}

/**
 * Get grid template columns based on variant
 */
function getGridTemplate(variant: string): string {
  switch (variant) {
    case 'minimal':
      return '2fr 1fr'
    case 'compact':
      return '1.5fr 1fr 1fr 1fr'
    case 'full':
    default:
      return '1fr 80px 120px 80px 120px'
  }
}

export default function ExecutionsTable({
  executions,
  variant = 'full',
  maxRows,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No executions found',
  className = '',
  formatDuration = defaultFormatDuration,
}: ExecutionsTableProps) {
  const { playClickSound } = useAudio()
  const columns = getColumns(variant)
  const gridTemplate = getGridTemplate(variant)
  
  // Limit rows if maxRows is specified
  const displayExecutions = maxRows ? executions.slice(0, maxRows) : executions

  const handleRowClick = (threadId: string) => {
    if (onRowClick) {
      playClickSound()
      onRowClick(threadId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, threadId: string) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleRowClick(threadId)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading} role="status" aria-label="Loading executions">
        Loading executions...
      </div>
    )
  }

  if (executions.length === 0) {
    return (
      <div className={styles.emptyState} role="status" aria-label={emptyMessage}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div 
      className={`${styles.executionsTable} ${styles[variant]} ${className}`}
      role="table" 
      aria-label="Executions table"
      style={{ '--grid-template': gridTemplate } as React.CSSProperties}
    >
      <div className={styles.tableHeader} role="row">
        {columns.includes('agent') && <span role="columnheader">Agent</span>}
        {columns.includes('status') && <span role="columnheader">Status</span>}
        {columns.includes('thread') && <span role="columnheader">Thread ID</span>}
        {columns.includes('started') && <span role="columnheader">Started</span>}
        {columns.includes('duration') && <span role="columnheader">Duration</span>}
      </div>
      
      {displayExecutions.map((execution, index) => (
        <div 
          key={execution.thread_id} 
          className={`${styles.executionRow} ${onRowClick ? styles.clickable : ''}`}
          role="row"
          tabIndex={onRowClick ? 0 : undefined}
          aria-label={`Execution ${index + 1}: Agent ${execution.agent}, Status ${execution.state}`}
          onClick={onRowClick ? () => handleRowClick(execution.thread_id) : undefined}
          onKeyDown={onRowClick ? (e) => handleKeyDown(e, execution.thread_id) : undefined}
        >
          {columns.includes('agent') && (
            <span className={styles.agentName} role="cell" aria-label={`Agent: ${execution.agent}`}>
              {execution.agent}
            </span>
          )}
          
          {columns.includes('status') && (
            <div role="cell" aria-label={`Status: ${execution.state}`}>
              <StatusBadge type="execution" status={execution.state} />
            </div>
          )}
          
          {columns.includes('thread') && (
            <span className={styles.threadId} role="cell" aria-label={`Thread ID: ${execution.thread_id}`}>
              {execution.thread_id.split('-')[0]}...
            </span>
          )}
          
          {columns.includes('started') && (
            <span 
              className={styles.timestamp} 
              role="cell" 
              aria-label={`Started at: ${execution.started_at ? format(new Date(execution.started_at), 'HH:mm:ss') : format(new Date(execution.created_at), 'HH:mm:ss')}`}
            >
              {execution.started_at 
                ? format(new Date(execution.started_at), 'HH:mm:ss')
                : format(new Date(execution.created_at), 'HH:mm:ss')
              }
            </span>
          )}
          
          {columns.includes('duration') && (
            <span 
              className={styles.duration} 
              role="cell" 
              aria-label={`Duration: ${execution.state === 'completed' && execution.started_at && execution.ended_at ? formatDuration(differenceInMilliseconds(new Date(execution.ended_at), new Date(execution.started_at))) : 'Not available'}`}
            >
              {execution.state === 'completed' && execution.started_at && execution.ended_at 
                ? formatDuration(differenceInMilliseconds(new Date(execution.ended_at), new Date(execution.started_at)))
                : '—'
              }
            </span>
          )}
        </div>
      ))}
    </div>
  )
}