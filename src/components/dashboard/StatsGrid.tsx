/**
 * Dashboard statistics grid component displaying key system metrics
 * 
 * Features:
 * - Agent counts (total, running, stopped)
 * - Execution metrics with performance indicators
 * - Performance success rate with color coding
 * - Click-to-navigate functionality with audio feedback
 * - Comprehensive accessibility with ARIA labels
 * 
 * @example
 * ```tsx
 * <StatsGrid 
 *   agentsData={agentsData} 
 *   performanceMetrics={performanceMetrics} 
 * />
 * ```
 */

import { useNavigate } from 'react-router-dom'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import styles from './StatsGrid.module.css'

interface AgentStats {
  totalAgents: number
  runningAgents: number
  stoppedAgents: number
  notCreated: number
}

interface PerformanceMetrics {
  totalExecutions: number
  recentExecutions: number
  successRate: number
  avgResponseTime: number
  runningExecutions: number
}

interface StatsGridProps {
  /** Agent statistics data */
  agentStats: AgentStats
  /** Performance metrics data */
  performanceMetrics: PerformanceMetrics
  /** Function to format duration values */
  formatDuration: (ms: number) => string
}

export default function StatsGrid({ 
  agentStats, 
  performanceMetrics, 
  formatDuration 
}: StatsGridProps) {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()

  return (
    <div className={styles.stats} role="region" aria-labelledby="dashboard-stats-heading">
      <h2 id="dashboard-stats-heading" className="sr-only">System Statistics</h2>
      
      <Card 
        onClick={() => {
          playClickSound()
          navigate('/agents')
        }}
        className={styles.clickableCard}
        ariaLabel={`Total Agents: ${agentStats.totalAgents}. ${agentStats.runningAgents} running, ${agentStats.stoppedAgents + agentStats.notCreated} stopped. Click to view all agents.`}
        role="button"
        tabIndex={0}
      >
        <div className={styles.stat}>
          <div className={styles.statLabel} id="total-agents-label">Total Agents</div>
          <div className={styles.statValue} aria-labelledby="total-agents-label">
            {agentStats.totalAgents}
          </div>
          <div 
            className={styles.statChange} 
            aria-label={`${agentStats.runningAgents} agents running, ${agentStats.stoppedAgents + agentStats.notCreated} agents stopped`}
          >
            {agentStats.runningAgents} on, {agentStats.stoppedAgents + agentStats.notCreated} off
          </div>
        </div>
      </Card>
      
      <Card 
        onClick={() => {
          playClickSound()
          navigate('/executions')
        }}
        className={styles.clickableCard}
        ariaLabel={`Total Executions: ${performanceMetrics.totalExecutions}. ${performanceMetrics.recentExecutions} in last hour. ${performanceMetrics.runningExecutions} currently running. Click to view all executions.`}
        role="button"
        tabIndex={0}
      >
        <div className={styles.stat}>
          <div className={styles.statLabel} id="executions-label">Executions</div>
          <div className={styles.statValue} aria-labelledby="executions-label">
            {performanceMetrics.totalExecutions}
          </div>
          <div 
            className={styles.statChange} 
            aria-label={`${performanceMetrics.recentExecutions} executions in last hour, ${performanceMetrics.runningExecutions} currently running`}
          >
            {performanceMetrics.recentExecutions > 0 
              ? `${performanceMetrics.recentExecutions} in last hour`
              : 'View all executions'
            }
            {performanceMetrics.runningExecutions > 0 && 
              <span className={styles.runningIndicator} aria-label={`${performanceMetrics.runningExecutions} executions running`}>
                {' • '}{performanceMetrics.runningExecutions} running
              </span>
            }
          </div>
        </div>
      </Card>
      
      <Card 
        className={styles.clickableCard}
        role="region"
        ariaLabel={`Performance: ${performanceMetrics.successRate > 0 ? `${performanceMetrics.successRate.toFixed(1)}% success rate` : 'No data available'}. ${performanceMetrics.avgResponseTime > 0 ? `Average response time: ${formatDuration(performanceMetrics.avgResponseTime)}` : ''}`}
      >
        <div className={styles.stat}>
          <div className={styles.statLabel} id="performance-label">Performance</div>
          <div 
            className={`${styles.statValue} ${
              performanceMetrics.successRate >= 95 ? styles.statValueSuccess :
              performanceMetrics.successRate >= 80 ? styles.statValueWarning :
              performanceMetrics.successRate > 0 ? styles.statValueError : styles.statValueDefault
            }`} 
            aria-labelledby="performance-label"
            aria-describedby="performance-description"
          >
            {performanceMetrics.successRate > 0 
              ? `${performanceMetrics.successRate.toFixed(1)}%`
              : '—'
            }
          </div>
          <div 
            className={styles.statChange} 
            id="performance-description"
            aria-label={performanceMetrics.avgResponseTime > 0 ? `Average response time: ${formatDuration(performanceMetrics.avgResponseTime)}` : 'Success rate - no data available'}
          >
            {performanceMetrics.avgResponseTime > 0
              ? `Avg: ${formatDuration(performanceMetrics.avgResponseTime)}`
              : 'Success rate'
            }
          </div>
        </div>
      </Card>
    </div>
  )
}