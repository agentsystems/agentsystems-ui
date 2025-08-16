import { useState } from 'react'
import Card from '@components/common/Card'
import styles from './Logs.module.css'

// Mock log data - replace with real WebSocket connection
const mockLogs = [
  { timestamp: new Date().toISOString(), level: 'info', message: 'Gateway started successfully', source: 'gateway' },
  { timestamp: new Date().toISOString(), level: 'info', message: 'Agent hello-world-agent discovered', source: 'discovery' },
  { timestamp: new Date().toISOString(), level: 'warning', message: 'Agent slow-agent took 5s to respond', source: 'gateway' },
  { timestamp: new Date().toISOString(), level: 'error', message: 'Failed to connect to agent broken-agent', source: 'gateway' },
]

export default function Logs() {
  const [logs] = useState(mockLogs)
  const [filter, setFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  const filteredLogs = logs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase()) ||
                       log.source.toLowerCase().includes(filter.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    return matchesText && matchesLevel
  })

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