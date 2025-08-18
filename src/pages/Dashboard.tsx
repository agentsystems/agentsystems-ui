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
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>System overview and metrics</p>
      </div>

      <div className={styles.stats}>
        <Card 
          onClick={() => {
            playClickSound()
            navigate('/agents')
          }}
          className={styles.clickableCard}
          ariaLabel="View all agents"
        >
          <div className={styles.stat}>
            <div className={styles.statLabel}>Total Agents</div>
            <div className={styles.statValue}>{stats.totalAgents}</div>
            <div className={styles.statChange}>
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
          ariaLabel="View executions"
        >
          <div className={styles.stat}>
            <div className={styles.statLabel}>Executions</div>
            <div className={styles.statValue}>
              {performanceMetrics.totalExecutions}
            </div>
            <div className={styles.statChange}>
              {performanceMetrics.recentExecutions > 0 
                ? `${performanceMetrics.recentExecutions} in last hour`
                : 'View all executions'
              }
              {performanceMetrics.runningExecutions > 0 && 
                <span style={{ color: 'var(--primary)' }}> • {performanceMetrics.runningExecutions} running</span>
              }
            </div>
          </div>
        </Card>
        
        <Card className={styles.clickableCard}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Performance</div>
            <div className={styles.statValue} style={{ 
              color: performanceMetrics.successRate >= 95 ? 'var(--success)' :
                     performanceMetrics.successRate >= 80 ? 'var(--warning)' :
                     performanceMetrics.successRate > 0 ? 'var(--error)' : 'inherit'
            }}>
              {performanceMetrics.successRate > 0 
                ? `${performanceMetrics.successRate.toFixed(1)}%`
                : '—'
              }
            </div>
            <div className={styles.statChange}>
              {performanceMetrics.avgResponseTime > 0
                ? `Avg: ${formatDuration(performanceMetrics.avgResponseTime)}`
                : 'Success rate'
              }
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.panels}>
        <Card className={styles.recentActivity}>
          <div className={styles.executionHeader}>
            <h2>Recent Executions</h2>
            <button 
              className="btn btn-sm btn-subtle"
              onClick={() => {
                playClickSound()
                navigate('/executions')
              }}
            >
              View All
            </button>
          </div>
          <div className={styles.activityList}>
            {!executionsData?.executions || executionsData.executions.length === 0 ? (
              <div className={styles.emptyState}>
                No recent executions
              </div>
            ) : (
              <div className={styles.executionsTable}>
                <div className={styles.tableHeader}>
                  <span>Agent</span>
                  <span>Status</span>
                  <span>Started</span>
                  <span>Duration</span>
                </div>
                {executionsData.executions.slice(0, 5).map((exec: any) => (
                  <div 
                    key={exec.thread_id} 
                    className={styles.executionRow}
                    onClick={() => {
                      playClickSound()
                      // Navigate to specific execution, not just executions page
                      window.location.href = `/executions?thread=${exec.thread_id}`
                    }}
                  >
                    <span className={styles.agentName}>{exec.agent}</span>
                    <span 
                      className={styles.status}
                      style={{ 
                        color: exec.state === 'completed' ? 'var(--success)' : 
                               exec.state === 'failed' ? 'var(--error)' : 
                               exec.state === 'running' ? 'var(--primary)' : 'var(--warning)'
                      }}
                    >
                      {exec.state}
                    </span>
                    <span className={styles.timestamp}>
                      {exec.started_at 
                        ? format(new Date(exec.started_at), 'HH:mm:ss')
                        : format(new Date(exec.created_at), 'HH:mm:ss')
                      }
                    </span>
                    <span className={styles.duration}>
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

        <Card className={styles.systemHealth}>
          <h2>System Health</h2>
          <div className={styles.healthMetrics}>
            <div className={styles.metric}>
              <span>Gateway</span>
              <span className={healthData?.status === 'ok' ? styles.healthGood : styles.healthBad}>
                {healthData?.status === 'ok' ? 'Operational' : healthData?.status || 'Unknown'}
              </span>
            </div>
            <div className={styles.metric}>
              <span>Active Jobs</span>
              <span className={performanceMetrics.runningExecutions > 0 ? styles.healthWarning : styles.healthGood}>
                {performanceMetrics.runningExecutions}
              </span>
            </div>
            <div className={styles.metric}>
              <span>Last Activity</span>
              <span className={styles.healthGood}>
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