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
import { useEffect } from 'react'
import { agentsApi } from '@api/agents'
import { api } from '@api/client'
import type { Execution } from '../types/api'
import StatsGrid from '@components/dashboard/StatsGrid'
import RecentExecutions from '@components/dashboard/RecentExecutions'
import SystemHealth from '@components/dashboard/SystemHealth'
import { differenceInMilliseconds } from 'date-fns'
import { useTour } from '@hooks/useTour'
import { useTourStore } from '@stores/tourStore'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { startExecutionFirstTour } = useTour()
  const { hasCompletedTour, isTourActive } = useTourStore()

  // Check if we should show tour on first visit - only once on mount
  useEffect(() => {
    console.log('Dashboard: Tour check - hasCompletedTour:', hasCompletedTour, 'isTourActive:', isTourActive)

    // Only start tour if: not completed, not already active, and on dashboard
    if (!hasCompletedTour && !isTourActive && window.location.pathname === '/dashboard') {
      console.log('Dashboard: Scheduling tour start in 1500ms')
      // Wait for page to be fully rendered and animations to settle
      const timer = setTimeout(() => {
        console.log('Dashboard: Timer fired, checking readyState:', document.readyState)
        // Additional check to ensure DOM is stable
        if (document.readyState === 'complete') {
          console.log('Dashboard: DOM complete, starting tour')
          startExecutionFirstTour()
        } else {
          console.log('Dashboard: DOM not ready, waiting 500ms more')
          // Wait a bit more if still loading
          setTimeout(() => {
            console.log('Dashboard: Delayed start, starting tour now')
            startExecutionFirstTour()
          }, 500)
        }
      }, 1500) // Increased delay to prevent flicker

      return () => {
        console.log('Dashboard: Cleanup - clearing timer')
        clearTimeout(timer)
      }
    }
  }, [hasCompletedTour, isTourActive, startExecutionFirstTour]) // Include all dependencies

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
    queryFn: () => api.get<{ status: string }>('/health'),
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
    const completed = executions.filter((e: Execution) => e.state === 'completed').length
    const failed = executions.filter((e: Execution) => e.state === 'failed').length  
    const running = executions.filter((e: Execution) => e.state === 'running').length

    // Calculate executions in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentExecutions = executions.filter((e: Execution) => 
      new Date(e.created_at) > oneHourAgo
    ).length

    // Calculate average response time for completed executions
    const responseTimes = executions
      .filter((e: Execution) => e.state === 'completed' && e.started_at && e.ended_at)
      .map((e: Execution) => differenceInMilliseconds(new Date(e.ended_at!), new Date(e.started_at!)))

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