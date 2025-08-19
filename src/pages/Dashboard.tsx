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
import { agentsApi } from '@api/agents'
import { api } from '@api/client'
import type { HealthResponse } from '../types/api'
import StatsGrid from '@components/dashboard/StatsGrid'
import RecentExecutions from '@components/dashboard/RecentExecutions'
import SystemHealth from '@components/dashboard/SystemHealth'
import { differenceInMilliseconds } from 'date-fns'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  // Fetch data for dashboard components
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
  })

  const { data: executionsData } = useQuery({
    queryKey: ['executions', 'dashboard'],
    queryFn: () => agentsApi.listExecutions({ limit: 100 }),
    refetchInterval: 10000,
  })

  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get<HealthResponse>('/health'),
    refetchInterval: 30000,
  })

  // Calculate stats for components
  const agentStats = {
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

      <StatsGrid 
        agentStats={agentStats}
        performanceMetrics={performanceMetrics}
        formatDuration={formatDuration}
      />

      <div className={styles.panels} role="region" aria-labelledby="dashboard-panels-heading">
        <h2 id="dashboard-panels-heading" className="sr-only">Dashboard Panels</h2>
        
        <RecentExecutions 
          executionsData={executionsData}
          formatDuration={formatDuration}
        />

        <SystemHealth 
          healthData={healthData}
          activeJobs={performanceMetrics.runningExecutions}
          lastExecution={executionsData?.executions?.[0]}
        />
      </div>
    </div>
  )
}