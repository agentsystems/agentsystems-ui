import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import styles from './Agents.module.css'

export default function Agents() {
  const navigate = useNavigate()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading agents...</div>
  }

  if (error) {
    return <div className={styles.error}>Failed to load agents</div>
  }

  const agents = data?.agents || []

  return (
    <div className={styles.agents}>
      <div className={styles.header}>
        <h1>Agents</h1>
        <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
      </div>

      <div className={styles.grid}>
        {agents.map((agent) => (
          <Card
            key={agent.name}
            variant="bordered"
            onClick={() => navigate(`/agents/${agent.name}`)}
            className={styles.agentCard}
          >
            <div className={styles.agentHeader}>
              <h3 className={styles.agentName}>{agent.name}</h3>
              <div className={`${styles.status} ${styles[agent.state === 'not-created' ? 'notcreated' : agent.state]}`}>
                {agent.state}
              </div>
            </div>
            
            <div className={styles.agentInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>{agent.state}</span>
              </div>
            </div>

            <div className={styles.agentActions}>
              {agent.state === 'stopped' && (
                <button className={styles.startBtn}>Start</button>
              )}
              {agent.state === 'running' && (
                <button className={styles.stopBtn}>Stop</button>
              )}
              <button className={styles.invokeBtn}>Invoke</button>
            </div>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card className={styles.emptyState}>
          <p>No agents found</p>
          <p className={styles.emptyHint}>
            Deploy agents using the AgentSystems SDK
          </p>
        </Card>
      )}
    </div>
  )
}