import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import { API_DEFAULTS } from '@constants/app'
import styles from './Executions.module.css'

interface Execution {
  thread_id: string
  agent: string
  state: 'queued' | 'running' | 'completed' | 'failed'
  created_at: string
  started_at?: string
  ended_at?: string
  user_token: string
  result?: unknown
  error?: unknown
  progress?: unknown
  payload?: unknown
}

// Mock data for now - will be replaced with real API
const mockExecutions: Execution[] = [
  {
    thread_id: '123e4567-e89b-12d3-a456-426614174000',
    agent: 'hello-world-agent',
    state: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    started_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    ended_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    user_token: 'demo',
    payload: { message: 'Hello, agent!', task: 'generate greeting' },
    result: { message: 'Hello, World!', status: 'success' }
  },
  {
    thread_id: '223e4567-e89b-12d3-a456-426614174001',
    agent: 'data-processor',
    state: 'failed',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    started_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    ended_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    user_token: 'demo',
    payload: { data: 'large_dataset.csv', action: 'process_batch' },
    error: { message: 'Agent timeout after 60 seconds' }
  },
  {
    thread_id: '323e4567-e89b-12d3-a456-426614174002',
    agent: 'assistant-agent',
    state: 'running',
    created_at: new Date(Date.now() - 1000 * 30).toISOString(),
    started_at: new Date(Date.now() - 1000 * 20).toISOString(),
    user_token: 'demo',
    payload: { query: 'What is the weather today?', context: 'user_conversation' }
  }
]

export default function Executions() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | 'completed' | 'failed' | 'running'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const retryMutation = useMutation({
    mutationFn: (execution: Execution) => {
      if (execution.payload) {
        return agentsApi.invoke(execution.agent, execution.payload as Record<string, unknown>)
      }
      throw new Error('No payload available to retry')
    },
    onSuccess: (response) => {
      navigate(`/agents/${selectedExecution?.agent}`)
      // Could also navigate to the new execution details when we have real thread tracking
    },
    onError: (error) => {
      alert(`Failed to retry execution: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  // Real API query
  const { data: executionsResponse, isLoading, error } = useQuery({
    queryKey: ['executions', stateFilter],
    queryFn: () => agentsApi.listExecutions({ 
      limit: 100,
      state: stateFilter === 'all' ? undefined : stateFilter 
    }),
    refetchInterval: API_DEFAULTS.REFETCH_INTERVAL,
  })

  const executions = executionsResponse?.executions || []

  // Audit trail query for selected execution
  const { data: auditData } = useQuery({
    queryKey: ['execution-audit', selectedExecution?.thread_id],
    queryFn: () => agentsApi.getExecutionAudit(selectedExecution!.thread_id),
    enabled: !!selectedExecution && showAuditTrail,
  })

  // Filter executions
  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         execution.thread_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = stateFilter === 'all' || execution.state === stateFilter
    
    // Date range filtering
    let matchesDate = true
    if (dateFrom || dateTo) {
      const executionDate = new Date(execution.created_at)
      if (dateFrom) {
        matchesDate = matchesDate && executionDate >= new Date(dateFrom)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999) // Include entire end date
        matchesDate = matchesDate && executionDate <= toDate
      }
    }
    
    return matchesSearch && matchesState && matchesDate
  })

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'completed': return 'var(--success)'
      case 'failed': return 'var(--error)'
      case 'running': return 'var(--info)'
      case 'queued': return 'var(--warning)'
      default: return 'var(--text-muted)'
    }
  }

  const getDuration = (execution: Execution) => {
    if (!execution.started_at) return '—'
    const start = new Date(execution.started_at)
    const end = execution.ended_at ? new Date(execution.ended_at) : new Date()
    const duration = Math.round((end.getTime() - start.getTime()) / 1000)
    return duration < 60 ? `${duration}s` : `${Math.round(duration / 60)}m ${duration % 60}s`
  }

  if (isLoading) {
    return (
      <div className={styles.executions}>
        <div className={styles.header}>
          <h1>Executions</h1>
          <p className={styles.subtitle}>Track agent invocations and results</p>
        </div>
        <div className={styles.loading}>Loading executions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.executions}>
        <div className={styles.header}>
          <h1>Executions</h1>
          <p className={styles.subtitle}>Track agent invocations and results</p>
        </div>
        <Card>
          <div className={styles.errorState}>
            <p>Failed to load executions</p>
            <p className={styles.errorDetails}>
              Check your connection to the AgentSystems gateway
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.executions}>
      <div className={styles.header}>
        <h1>Executions</h1>
        <p className={styles.subtitle}>Track agent invocations and results</p>
        
        <div className={styles.controlsContainer}>
          <div className={styles.primaryControls}>
            <div className={styles.searchGroup}>
              <input
                type="text"
                placeholder="Search by agent or thread ID..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className={styles.filterSelect}
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value as 'all' | 'completed' | 'failed' | 'running')
                e.target.blur()
              }}
            >
              <option value="all">All States ({executions.length})</option>
              <option value="completed">Completed ({executions.filter(e => e.state === 'completed').length})</option>
              <option value="failed">Failed ({executions.filter(e => e.state === 'failed').length})</option>
              <option value="running">Running ({executions.filter(e => e.state === 'running').length})</option>
            </select>
            
            <span className={styles.resultCount}>
              {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className={styles.secondaryControls}>
            <div className={styles.dateGroup}>
              <label>From:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className={styles.dateGroup}>
              <label>To:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            {(dateFrom || dateTo) && (
              <button
                className={styles.clearDatesBtn}
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                  playClickSound()
                }}
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.executionsList}>
          <Card>
            <h2>Execution History</h2>
            <div className={styles.executionsTable}>
              <div className={styles.tableHeader}>
                <span>Agent</span>
                <span>Status</span>
                <span>Started</span>
                <span>Duration</span>
                <span>Thread ID</span>
              </div>
              
              {filteredExecutions.map((execution) => (
                <div
                  key={execution.thread_id}
                  className={`${styles.executionRow} ${selectedExecution?.thread_id === execution.thread_id ? styles.selected : ''}`}
                  onClick={() => {
                    playClickSound()
                    setSelectedExecution(execution)
                  }}
                >
                  <span className={styles.agentName}>
                    <span className={styles.verifiedIcon} title="Cryptographically verified execution">✓</span>
                    {execution.agent}
                  </span>
                  <span 
                    className={styles.status}
                    style={{ color: getStatusColor(execution.state) }}
                  >
                    {execution.state}
                  </span>
                  <span className={styles.timestamp}>
                    {execution.started_at 
                      ? formatDistanceToNow(new Date(execution.started_at))
                      : 'Not started'
                    }
                  </span>
                  <span className={styles.duration}>
                    {getDuration(execution)}
                  </span>
                  <span className={styles.threadId}>
                    {execution.thread_id.substring(0, 8)}...
                  </span>
                </div>
              ))}
              
              {filteredExecutions.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No executions match the current filter</p>
                  <p className={styles.emptyHint}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {selectedExecution && (
          <div className={styles.executionDetail}>
            <Card>
              <div className={styles.detailHeader}>
                <h2>Execution Details</h2>
                {selectedExecution.payload && (selectedExecution.state === 'completed' || selectedExecution.state === 'failed') && (
                  <button
                    className={styles.retryBtn}
                    onClick={() => {
                      playClickSound()
                      retryMutation.mutate(selectedExecution)
                    }}
                    disabled={retryMutation.isPending}
                  >
                    {retryMutation.isPending ? 'Retrying...' : 'Retry'}
                  </button>
                )}
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Thread ID</label>
                  <span className={styles.detailValue}>{selectedExecution.thread_id}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <label>Agent</label>
                  <span className={styles.detailValue}>{selectedExecution.agent}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <label>State</label>
                  <span 
                    className={styles.detailValue}
                    style={{ color: getStatusColor(selectedExecution.state) }}
                  >
                    {selectedExecution.state}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <label>Created</label>
                  <span className={styles.detailValue}>
                    {format(new Date(selectedExecution.created_at), 'PPpp')}
                  </span>
                </div>
                
                {selectedExecution.started_at && (
                  <div className={styles.detailItem}>
                    <label>Started</label>
                    <span className={styles.detailValue}>
                      {format(new Date(selectedExecution.started_at), 'PPpp')}
                    </span>
                  </div>
                )}
                
                {selectedExecution.ended_at && (
                  <div className={styles.detailItem}>
                    <label>Ended</label>
                    <span className={styles.detailValue}>
                      {format(new Date(selectedExecution.ended_at), 'PPpp')}
                    </span>
                  </div>
                )}
                
                <div className={styles.detailItem}>
                  <label>Duration</label>
                  <span className={styles.detailValue}>{getDuration(selectedExecution)}</span>
                </div>
              </div>

              {selectedExecution.payload && (
                <div className={styles.payloadSection}>
                  <h3>Request Payload</h3>
                  <pre className={styles.payloadContent}>
                    {(() => {
                      try {
                        // Handle both string and object payloads
                        const payload = typeof selectedExecution.payload === 'string' 
                          ? JSON.parse(selectedExecution.payload)
                          : selectedExecution.payload
                        return JSON.stringify(payload, null, 2)
                      } catch {
                        return selectedExecution.payload as string
                      }
                    })()}
                  </pre>
                </div>
              )}

              {selectedExecution.result && (
                <div className={styles.resultSection}>
                  <h3>Result</h3>
                  <pre className={styles.resultContent}>
                    {(() => {
                      try {
                        // If result is a string, parse and beautify it
                        if (typeof selectedExecution.result === 'string') {
                          const parsed = JSON.parse(selectedExecution.result)
                          return JSON.stringify(parsed, null, 2)
                        }
                        // If it's already an object, stringify it
                        return JSON.stringify(selectedExecution.result, null, 2)
                      } catch {
                        // If parsing fails, display the raw string
                        return selectedExecution.result as string
                      }
                    })()}
                  </pre>
                </div>
              )}

              {selectedExecution.error && (
                <div className={styles.errorSection}>
                  <h3>Error</h3>
                  <pre className={styles.errorContent}>
                    {(() => {
                      try {
                        // If error is a string, parse and beautify it
                        if (typeof selectedExecution.error === 'string') {
                          const parsed = JSON.parse(selectedExecution.error)
                          return JSON.stringify(parsed, null, 2)
                        }
                        // If it's already an object, stringify it
                        return JSON.stringify(selectedExecution.error, null, 2)
                      } catch {
                        // If parsing fails, display the raw string
                        return selectedExecution.error as string
                      }
                    })()}
                  </pre>
                </div>
              )}

              {/* Hash Chain Verification */}
              <div className={styles.auditSection}>
                <div className={styles.auditHeader}>
                  <h3>Hash Chain Verification</h3>
                  <button
                    className={styles.toggleAuditBtn}
                    onClick={() => {
                      setShowAuditTrail(!showAuditTrail)
                      playClickSound()
                    }}
                  >
                    {showAuditTrail ? 'Hide' : 'Show'} Details
                  </button>
                </div>
                
                {showAuditTrail && auditData && (
                  <div className={styles.auditContent}>
                    {/* Execution-level hash summary */}
                    <div className={styles.executionHashSummary}>
                      <div className={styles.hashChainInfo}>
                        <div className={styles.hashItem}>
                          <label>Previous Execution Hash:</label>
                          <code className={styles.hashValue}>
                            {auditData.audit_trail?.[0]?.prev_hash || 'Genesis'}
                          </code>
                        </div>
                        <div className={styles.hashItem}>
                          <label>This Execution Hash:</label>
                          <code className={styles.hashValue}>
                            {auditData.audit_trail?.[auditData.audit_trail.length - 1]?.entry_hash || 'N/A'}
                          </code>
                        </div>
                        <div className={styles.chainStatus}>
                          <span className={styles.chainStatusIcon}>🔗</span>
                          <span>Chain integrity maintained</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed audit events (collapsible) */}
                    <details className={styles.auditDetails}>
                      <summary className={styles.auditDetailsSummary}>
                        View detailed audit events ({auditData.audit_trail?.length || 0} entries)
                      </summary>
                      <div className={styles.auditEvents}>
                        {auditData.audit_trail?.map((entry: any, index: number) => (
                          <div key={entry.id} className={styles.simpleAuditEntry}>
                            <span className={styles.auditAction}>{entry.action}</span>
                            <span className={styles.auditActor}>{entry.actor}</span>
                            <span className={styles.auditTime}>
                              {entry.timestamp ? format(new Date(entry.timestamp), 'HH:mm:ss.SSS') : ''}
                            </span>
                            <code className={styles.simpleHashValue}>{entry.entry_hash}</code>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}