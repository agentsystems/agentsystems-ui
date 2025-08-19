/**
 * System health monitoring component displaying real-time system status
 * 
 * Features:
 * - Gateway operational status
 * - Active jobs count with status indicators
 * - Last activity tracking with relative timestamps
 * - Color-coded health indicators (good/warning/bad)
 * - Accessibility support with detailed ARIA labels
 * 
 * @example
 * ```tsx
 * <SystemHealth 
 *   healthData={healthData} 
 *   activeJobs={runningExecutions}
 *   lastActivity={lastExecution}
 * />
 * ```
 */

import { formatDistanceToNow } from 'date-fns'
import Card from '@components/common/Card'
import styles from './SystemHealth.module.css'

interface HealthData {
  status: string
}

interface SystemHealthProps {
  /** Health status data from API */
  healthData?: HealthData
  /** Number of currently active jobs */
  activeJobs: number
  /** Last execution for activity tracking */
  lastExecution?: {
    created_at: string
  }
}

export default function SystemHealth({ 
  healthData, 
  activeJobs, 
  lastExecution 
}: SystemHealthProps) {
  return (
    <Card className={styles.systemHealth} role="region" aria-labelledby="system-health-heading">
      <h2 id="system-health-heading">System Health</h2>
      <div className={styles.healthMetrics} role="list" aria-label="System health metrics">
        <div className={styles.metric} role="listitem">
          <span id="gateway-label">Gateway</span>
          <span 
            className={healthData?.status === 'ok' ? styles.healthGood : styles.healthBad}
            aria-labelledby="gateway-label"
            aria-label={`Gateway status: ${healthData?.status === 'ok' ? 'Operational' : healthData?.status || 'Unknown'}`}
          >
            {healthData?.status === 'ok' ? 'Operational' : healthData?.status || 'Unknown'}
          </span>
        </div>
        
        <div className={styles.metric} role="listitem">
          <span id="active-jobs-label">Active Jobs</span>
          <span 
            className={activeJobs > 0 ? styles.healthWarning : styles.healthGood}
            aria-labelledby="active-jobs-label"
            aria-label={`Active jobs: ${activeJobs} ${activeJobs === 1 ? 'job' : 'jobs'} running`}
          >
            {activeJobs}
          </span>
        </div>
        
        <div className={styles.metric} role="listitem">
          <span id="last-activity-label">Last Activity</span>
          <span 
            className={styles.healthGood}
            aria-labelledby="last-activity-label"
            aria-label={`Last activity: ${lastExecution ? formatDistanceToNow(new Date(lastExecution.created_at), { addSuffix: true }) : 'No activity recorded'}`}
          >
            {lastExecution 
              ? formatDistanceToNow(new Date(lastExecution.created_at), { addSuffix: true })
              : 'No activity'
            }
          </span>
        </div>
      </div>
    </Card>
  )
}