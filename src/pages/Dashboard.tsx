import { useQuery } from '@tanstack/react-query'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
  })

  const stats = {
    totalAgents: agentsData?.agents.length || 0,
    runningAgents: agentsData?.agents.filter(a => a.state === 'running').length || 0,
    stoppedAgents: agentsData?.agents.filter(a => a.state === 'stopped').length || 0,
    notCreated: agentsData?.agents.filter(a => a.state === 'not-created').length || 0,
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>System overview and metrics</p>
      </div>

      <div className={styles.stats}>
        <Card>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.totalAgents}</div>
            <div className={styles.statLabel}>Total Agents</div>
          </div>
        </Card>
        
        <Card>
          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--success)' }}>
              {stats.runningAgents}
            </div>
            <div className={styles.statLabel}>Running</div>
          </div>
        </Card>
        
        <Card>
          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--warning)' }}>
              {stats.stoppedAgents}
            </div>
            <div className={styles.statLabel}>Stopped</div>
          </div>
        </Card>
        
        <Card>
          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--text-muted)' }}>
              {stats.notCreated}
            </div>
            <div className={styles.statLabel}>Not Created</div>
          </div>
        </Card>
      </div>

      <div className={styles.panels}>
        <Card className={styles.recentActivity}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            <div className={styles.emptyState}>
              No recent activity
            </div>
          </div>
        </Card>

        <Card className={styles.systemHealth}>
          <h2>System Health</h2>
          <div className={styles.healthMetrics}>
            <div className={styles.metric}>
              <span>Gateway</span>
              <span className={styles.healthGood}>Healthy</span>
            </div>
            <div className={styles.metric}>
              <span>Database</span>
              <span className={styles.healthGood}>Connected</span>
            </div>
            <div className={styles.metric}>
              <span>Docker</span>
              <span className={styles.healthGood}>Running</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}