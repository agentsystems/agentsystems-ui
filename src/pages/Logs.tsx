import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import styles from './Logs.module.css'

export default function Logs() {
  const [filter, setFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  // Get real logs from gateway (simple approach)
  const { data: logsData, isLoading, error } = useQuery({
    queryKey: ['logs'],
    queryFn: () => agentsApi.getLogs(150), // Get last 150 logs
    refetchInterval: 15000, // Every 15 seconds
    refetchOnWindowFocus: false, // Don't spam on tab switch
    refetchIntervalInBackground: false, // Stop when tab inactive
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    cacheTime: 0, // Don't cache log data
  })

  const logs = logsData?.logs || []

  const filteredLogs = logs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase()) ||
                       log.source.toLowerCase().includes(filter.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    return matchesText && matchesLevel
  })

  if (isLoading) {
    return (
      <div className={styles.logs}>
        <div className={styles.header}>
          <h1>Logs</h1>
          <p className={styles.subtitle}>Real-time system logs and events</p>
        </div>
        <div className={styles.loading}>Loading logs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.logs}>
        <div className={styles.header}>
          <h1>Logs</h1>
          <p className={styles.subtitle}>Real-time system logs and events</p>
        </div>
        <Card>
          <div className={styles.errorState}>
            <p>Failed to load logs</p>
            <p>Check your connection to the AgentSystems gateway</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.logs}>
      <div className={styles.header}>
        <h1>Logs</h1>
        <p className={styles.subtitle}>Real-time system logs and events</p>
      </div>

      <Card>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Filter logs..."
            className={styles.searchInput}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <select
            className={styles.levelSelect}
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value)
              e.target.blur() // Remove focus after selection
            }}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className={styles.logContainer}>
          {filteredLogs.map((log, index) => (
            <div key={index} className={`${styles.logEntry} ${styles[log.level]}`}>
              <span className={styles.timestamp}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={styles.level}>[{log.level.toUpperCase()}]</span>
              <span className={styles.source}>[{log.source}]</span>
              <span className={styles.message}>{log.message}</span>
            </div>
          ))}
          
        </div>
      </Card>
    </div>
  )
}