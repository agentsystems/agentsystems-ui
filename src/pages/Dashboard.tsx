import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  
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
            <div className={styles.statChange}>View all agents</div>
          </div>
        </Card>
        
        <Card 
          onClick={() => {
            playClickSound()
            navigate('/agents?filter=running')
          }}
          className={styles.clickableCard}
          ariaLabel="View running agents"
        >
          <div className={styles.stat}>
            <div className={styles.statLabel}>Running</div>
            <div className={styles.statValue} style={{ color: 'var(--success)' }}>
              {stats.runningAgents}
            </div>
            <div className={styles.statChange}>Click to view running agents</div>
          </div>
        </Card>
        
        <Card 
          onClick={() => {
            playClickSound()
            navigate('/agents?filter=idle')
          }}
          className={styles.clickableCard}
          ariaLabel="View stopped agents"
        >
          <div className={styles.stat}>
            <div className={styles.statLabel}>Stopped</div>
            <div className={styles.statValue} style={{ color: 'var(--warning)' }}>
              {stats.stoppedAgents + stats.notCreated}
            </div>
            <div className={styles.statChange}>Click to view stopped agents</div>
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