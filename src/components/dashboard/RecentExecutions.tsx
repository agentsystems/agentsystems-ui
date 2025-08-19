/**
 * Recent executions panel component displaying latest agent executions
 * 
 * Features:
 * - Recent executions table with agent, status, timing, and duration
 * - Click-to-navigate to specific execution details
 * - Real-time status updates with live regions
 * - Keyboard navigation support
 * - Empty state handling
 * - Comprehensive accessibility with ARIA labels
 * 
 * @example
 * ```tsx
 * <RecentExecutions executionsData={executionsData} />
 * ```
 */

import { useNavigate } from 'react-router-dom'
import Card from '@components/common/Card'
import ExecutionsTable from '@components/common/ExecutionsTable'
import { useAudio } from '@hooks/useAudio'
import styles from './RecentExecutions.module.css'

interface Execution {
  thread_id: string
  agent: string
  state: 'completed' | 'failed' | 'running' | 'queued'
  created_at: string
  started_at?: string
  ended_at?: string
}

interface ExecutionsData {
  executions: Execution[]
}

interface RecentExecutionsProps {
  /** Executions data from API */
  executionsData?: ExecutionsData
  /** Function to format duration values */
  formatDuration: (ms: number) => string
}

export default function RecentExecutions({ 
  executionsData, 
  formatDuration 
}: RecentExecutionsProps) {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()

  return (
    <Card className={styles.recentActivity} role="region" aria-labelledby="recent-executions-heading">
      <div className={styles.executionHeader}>
        <h2 id="recent-executions-heading">Recent Executions</h2>
        <button 
          className="btn btn-sm btn-subtle"
          onClick={() => {
            playClickSound()
            navigate('/executions')
          }}
          aria-label="View all executions page"
        >
          View All
        </button>
      </div>
      
      <div className={styles.activityList} aria-live="polite">
        <ExecutionsTable
          executions={executionsData?.executions || []}
          variant="compact"
          maxRows={5}
          onRowClick={(threadId) => {
            window.location.href = `/executions?thread=${threadId}`
          }}
          emptyMessage="No recent executions"
          formatDuration={formatDuration}
        />
      </div>
    </Card>
  )
}