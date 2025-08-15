import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import ErrorMessage from '@components/ErrorMessage'
import styles from './Agents.module.css'

export default function Agents() {
  const navigate = useNavigate()
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
    retry: 2,
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading agents...</div>
  }

  if (error) {
    return (
      <div className={styles.agents}>
        <div className={styles.header}>
          <h1>Agents</h1>
          <p className={styles.subtitle}>Manage and monitor your deployed agents</p>
        </div>
        <ErrorMessage 
          message="Failed to load agents. Please check your connection to the AgentSystems gateway."
          onRetry={() => refetch()}
        />
      </div>
    )
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
            onClick={() => navigate(`/agents/${agent.name}`)}
            className={styles.agentCard}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentInfo}>
                <h3 className={styles.agentName}>{agent.name}</h3>
                <div className={styles.agentImage}>
                  {agent.name.includes('hello-world') ? 'agentsystems/hello-world-agent:latest' :
                   agent.name.includes('template') ? 'agentsystems/agent-template:latest' :
                   agent.name.includes('jokes') ? 'private-repository-examples/historical-events-jokes:0.1.0' :
                   agent.name.includes('poetry') ? 'public-repository-examples/historical-events-poetry:0.1.0' :
                   agent.name.includes('ibl') ? 'ironbirdlabs/ibl-agent-hello-there:latest' :
                   `${agent.name}:latest`}
                </div>
              </div>
              <div className={`${styles.status} ${styles[agent.state === 'not-created' ? 'notcreated' : agent.state]}`}>
                {agent.state}
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