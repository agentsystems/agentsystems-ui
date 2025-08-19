/**
 * Dashboard page component providing system overview and real-time metrics
 * 
 * Features:
 * - Real-time agent statistics (total, running, stopped)
 * - Execution metrics with performance indicators
 * - Recent activity feed with clickable rows
 * - System health monitoring (Gateway, Active Jobs, Last Activity)
 * - Auto-refreshing data (agents: 5s, executions: 10s, health: 30s)
 * - Comprehensive accessibility with ARIA labels and keyboard navigation
 * - Performance color coding (green/yellow/red indicators)
 * - Click-to-navigate cards with audio feedback
 * 
 * Data Sources:
 * - `/agents` - Agent discovery and state information
 * - `/executions` - Recent execution history and metrics
 * - `/health` - Gateway health status
 * 
 * @example
 * ```tsx
 * <Route path="dashboard" element={<Dashboard />} />
 * ```
 */

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import { api } from '@api/client'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import { differenceInMilliseconds, format, formatDistanceToNow } from 'date-fns'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
  })

  // Fetch recent executions for performance metrics
  const { data: executionsData } = useQuery({
    queryKey: ['executions', 'dashboard'],
    queryFn: () => agentsApi.listExecutions({ limit: 100 }),
    refetchInterval: 10000,
  })

  // Fetch system health
  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health'),
    refetchInterval: 30000,
  })

  const stats = {
    totalAgents: agentsData?.agents.length || 0,
    runningAgents: agentsData?.agents.filter(a => a.state === 'running').length || 0,
    stoppedAgents: agentsData?.agents.filter(a => a.state === 'stopped').length || 0,
    notCreated: agentsData?.agents.filter(a => a.state === 'not-created').length || 0,
  }

  // Calculate performance metrics
  const performanceMetrics = (() => {
    if (!executionsData?.executions) {
      return {
        totalExecutions: 0,
        recentExecutions: 0,
        successRate: 0,
        avgResponseTime: 0,
        runningExecutions: 0
      }
    }

    const executions = executionsData.executions
    const total = executions.length
    const completed = executions.filter((e: any) => e.state === 'completed').length
    const failed = executions.filter((e: any) => e.state === 'failed').length  
    const running = executions.filter((e: any) => e.state === 'running').length

    // Calculate executions in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentExecutions = executions.filter((e: any) => 
      new Date(e.created_at) > oneHourAgo
    ).length

    // Calculate average response time for completed executions
    const responseTimes = executions
      .filter((e: any) => e.state === 'completed' && e.started_at && e.ended_at)
      .map((e: any) => differenceInMilliseconds(new Date(e.ended_at), new Date(e.started_at)))

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
      : 0

    return {
      totalExecutions: executionsData.total || total,
      recentExecutions,
      successRate: total > 0 ? (completed / (completed + failed)) * 100 : 0,
      avgResponseTime,
      runningExecutions: running
    }
  })()

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  return (
    <div className={styles.dashboard} role="main" aria-label="Dashboard">
      <div className={styles.header}>
        <h1 id="dashboard-title">Dashboard</h1>
        <p className={styles.subtitle} id="dashboard-subtitle">System overview and metrics</p>
      </div>

      <div className={styles.stats} role="region" aria-labelledby="dashboard-stats-heading">
        <h2 id="dashboard-stats-heading" className="sr-only">System Statistics</h2>
        <Card 
          onClick={() => {
            playClickSound()
            navigate('/agents')
          }}
          className={styles.clickableCard}
          ariaLabel={`Total Agents: ${stats.totalAgents}. ${stats.runningAgents} running, ${stats.stoppedAgents + stats.notCreated} stopped. Click to view all agents.`}
          role="button"
          tabIndex={0}
        >
          <div className={styles.stat}>
            <div className={styles.statLabel} id="total-agents-label">Total Agents</div>
            <div className={styles.statValue} aria-labelledby="total-agents-label">{stats.totalAgents}</div>
            <div className={styles.statChange} aria-label={`${stats.runningAgents} agents running, ${stats.stoppedAgents + stats.notCreated} agents stopped`}>
              {stats.runningAgents} on, {stats.stoppedAgents + stats.notCreated} off
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
            <div className={styles.statChange} aria-label={`${performanceMetrics.recentExecutions} executions in last hour, ${performanceMetrics.runningExecutions} currently running`}>
              {performanceMetrics.recentExecutions > 0 
                ? `${performanceMetrics.recentExecutions} in last hour`
                : 'View all executions'
              }
              {performanceMetrics.runningExecutions > 0 && 
                <span style={{ color: 'var(--primary)' }} aria-label={`${performanceMetrics.runningExecutions} executions running`}> • {performanceMetrics.runningExecutions} running</span>
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
              className={styles.statValue} 
              aria-labelledby="performance-label"
              aria-describedby="performance-description"
              style={{ 
                color: performanceMetrics.successRate >= 95 ? 'var(--success)' :
                       performanceMetrics.successRate >= 80 ? 'var(--warning)' :
                       performanceMetrics.successRate > 0 ? 'var(--error)' : 'inherit'
              }}
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

      <div className={styles.panels} role="region" aria-labelledby="dashboard-panels-heading">
        <h2 id="dashboard-panels-heading" className="sr-only">Dashboard Panels</h2>
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
            {!executionsData?.executions || executionsData.executions.length === 0 ? (
              <div className={styles.emptyState} role="status" aria-label="No recent executions available">
                No recent executions
              </div>
            ) : (
              <div className={styles.executionsTable} role="table" aria-label="Recent executions table">
                <div className={styles.tableHeader} role="row">
                  <span role="columnheader">Agent</span>
                  <span role="columnheader">Status</span>
                  <span role="columnheader">Started</span>
                  <span role="columnheader">Duration</span>
                </div>
                {executionsData.executions.slice(0, 5).map((exec: any, index: number) => (
                  <div 
                    key={exec.thread_id} 
                    className={styles.executionRow}
                    role="row"
                    tabIndex={0}
                    aria-label={`Execution ${index + 1}: Agent ${exec.agent}, Status ${exec.state}, Started ${exec.started_at ? format(new Date(exec.started_at), 'HH:mm:ss') : format(new Date(exec.created_at), 'HH:mm:ss')}`}
                    onClick={() => {
                      playClickSound()
                      // Navigate to specific execution, not just executions page
                      window.location.href = `/executions?thread=${exec.thread_id}`
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        playClickSound()
                        window.location.href = `/executions?thread=${exec.thread_id}`
                      }
                    }}
                  >
                    <span className={styles.agentName} role="cell" aria-label={`Agent: ${exec.agent}`}>{exec.agent}</span>
                    <span 
                      className={styles.status}
                      role="cell"
                      aria-label={`Status: ${exec.state}`}
                      style={{ 
                        color: exec.state === 'completed' ? 'var(--success)' : 
                               exec.state === 'failed' ? 'var(--error)' : 
                               exec.state === 'running' ? 'var(--primary)' : 'var(--warning)'
                      }}
                    >
                      {exec.state}
                    </span>
                    <span className={styles.timestamp} role="cell" aria-label={`Started at: ${exec.started_at ? format(new Date(exec.started_at), 'HH:mm:ss') : format(new Date(exec.created_at), 'HH:mm:ss')}`}>
                      {exec.started_at 
                        ? format(new Date(exec.started_at), 'HH:mm:ss')
                        : format(new Date(exec.created_at), 'HH:mm:ss')
                      }
                    </span>
                    <span className={styles.duration} role="cell" aria-label={`Duration: ${exec.state === 'completed' && exec.started_at && exec.ended_at ? formatDuration(differenceInMilliseconds(new Date(exec.ended_at), new Date(exec.started_at))) : 'Not available'}`}>
                      {exec.state === 'completed' && exec.started_at && exec.ended_at 
                        ? formatDuration(
                            differenceInMilliseconds(
                              new Date(exec.ended_at),
                              new Date(exec.started_at)
                            )
                          )
                        : '—'
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

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
                className={performanceMetrics.runningExecutions > 0 ? styles.healthWarning : styles.healthGood}
                aria-labelledby="active-jobs-label"
                aria-label={`Active jobs: ${performanceMetrics.runningExecutions} ${performanceMetrics.runningExecutions === 1 ? 'job' : 'jobs'} running`}
              >
                {performanceMetrics.runningExecutions}
              </span>
            </div>
            <div className={styles.metric} role="listitem">
              <span id="last-activity-label">Last Activity</span>
              <span 
                className={styles.healthGood}
                aria-labelledby="last-activity-label"
                aria-label={`Last activity: ${executionsData?.executions?.[0] ? formatDistanceToNow(new Date(executionsData.executions[0].created_at), { addSuffix: true }) : 'No activity recorded'}`}
              >
                {executionsData?.executions?.[0] 
                  ? formatDistanceToNow(new Date(executionsData.executions[0].created_at), { addSuffix: true })
                  : 'No activity'
                }
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}