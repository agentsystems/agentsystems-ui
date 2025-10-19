import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DocumentDuplicateIcon, ArrowTopRightOnSquareIcon, CheckIcon, ShieldCheckIcon, ShieldExclamationIcon, ArrowPathIcon, XMarkIcon, CalendarIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { agentsApi } from '@api/agents'
import { apiClient } from '@api/client'
import type { AuditEntry } from '../types/api'
import Card from '@components/common/Card'

interface ApiError {
  response?: {
    status?: number
  }
}
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Toast from '@components/Toast'
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

interface ArtifactFile {
  name: string
  path: string
  size: number
  modified: string
  type: 'in' | 'out'
}


export default function Executions() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showError } = useToast()
  const [searchParams] = useSearchParams()
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | 'completed' | 'failed' | 'running'>('all')
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'compromised'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [previewFile, setPreviewFile] = useState<ArtifactFile | null>(null)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'artifacts' | 'data' | 'audit'>('overview')
  const [copiedThreadId, setCopiedThreadId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const retryMutation = useMutation({
    mutationFn: (execution: Execution) => {
      if (execution.payload) {
        return agentsApi.invoke(execution.agent, execution.payload as Record<string, unknown>)
      }
      throw new Error('No payload available to retry')
    },
    onSuccess: () => {
      navigate(`/agents/${selectedExecution?.agent}`)
      // Could also navigate to the new execution details when we have real thread tracking
    },
    onError: (error) => {
      showError(`Failed to retry execution: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  // Real API query with dynamic polling
  const { data: executionsResponse, isLoading, error } = useQuery({
    queryKey: ['executions'],
    queryFn: () => agentsApi.listExecutions({ 
      limit: 100
      // Always fetch all executions - filter on client side
    }),
    refetchInterval: (query) => {
      const executions = query.state.data?.executions || []
      const hasRunning = executions.some((e: Execution) => e.state === 'running' || e.state === 'queued')
      return hasRunning ? API_DEFAULTS.EXECUTIONS_FAST_INTERVAL : API_DEFAULTS.EXECUTIONS_SLOW_INTERVAL
    },
  })

  const executions = useMemo(() => executionsResponse?.executions || [], [executionsResponse?.executions])

  // Bulk audit verification
  const { data: auditVerification } = useQuery({
    queryKey: ['audit-verification'],
    queryFn: agentsApi.verifyAuditIntegrity,
    refetchInterval: 30000, // Check every 30 seconds
  })

  // Get unique thread IDs that are compromised
  const compromisedThreadIds = new Set(
    auditVerification?.compromised_entries?.map(entry => entry.thread_id) || []
  )
  const compromisedExecutionCount = compromisedThreadIds.size


  // Audit trail query for selected execution
  const { data: auditData } = useQuery({
    queryKey: ['execution-audit', selectedExecution?.thread_id],
    queryFn: () => agentsApi.getExecutionAudit(selectedExecution!.thread_id),
    enabled: !!selectedExecution,
  })

  // Fetch artifacts for selected execution
  const { data: artifactsData } = useQuery({
    queryKey: ['execution-artifacts', selectedExecution?.thread_id],
    queryFn: () => agentsApi.getArtifacts(selectedExecution!.thread_id),
    enabled: !!selectedExecution,
  })


  // Initialize from URL parameters (one time only)
  useEffect(() => {
    const threadParam = searchParams.get('thread')
    const agentParam = searchParams.get('agent')
    
    // Auto-select execution from thread parameter
    if (threadParam && executions.length > 0) {
      const execution = executions.find(e => e.thread_id === threadParam)
      if (execution) {
        setSelectedExecution(execution)
      }
    }
    
    // Set initial search query from agent parameter (only if search is empty)
    if (agentParam && searchQuery === '') {
      setSearchQuery(agentParam)
    }
  }, [executions, searchParams, searchQuery])

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
    
    // Verification filter
    let matchesVerification = true
    if (verificationFilter === 'compromised') {
      matchesVerification = compromisedThreadIds.has(execution.thread_id)
    } else if (verificationFilter === 'verified') {
      matchesVerification = !compromisedThreadIds.has(execution.thread_id)
    }
    
    return matchesSearch && matchesState && matchesDate && matchesVerification
  })

  const getStatusClass = (state: string) => {
    switch (state) {
      case 'completed': return styles.statusCompleted
      case 'failed': return styles.statusFailed
      case 'running': return styles.statusRunning
      case 'queued': return styles.statusQueued
      default: return styles.statusQueued
    }
  }

  // Live timer for running executions
  useEffect(() => {
    const interval = setInterval(() => {
      const hasRunning = executions.some(e => e.state === 'running')
      if (hasRunning) {
        setCurrentTime(new Date())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [executions])

  const getDuration = (execution: Execution) => {
    if (!execution.started_at) return '—'
    const start = new Date(execution.started_at)
    // Use currentTime for running executions to get live updates
    const end = execution.ended_at ? new Date(execution.ended_at) : currentTime
    const duration = Math.round((end.getTime() - start.getTime()) / 1000)
    return duration < 60 ? `${duration}s` : `${Math.round(duration / 60)}m ${duration % 60}s`
  }

  // File utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    return <DocumentIcon className={styles.fileIcon} />
  }

  const openPreview = async (file: ArtifactFile) => {
    try {
      playClickSound()
      setPreviewFile(file)
      setPreviewLoading(true)
      setPreviewContent(null)
      
      // Check if file type is previewable
      const ext = file.name.split('.').pop()?.toLowerCase()
      const previewableTypes = ['txt', 'md', 'json', 'csv', 'log', 'yaml', 'yml', 'py', 'js', 'ts', 'html', 'css']
      
      if (!previewableTypes.includes(ext || '')) {
        setPreviewContent(`Preview not available for .${ext} files`)
        setPreviewLoading(false)
        return
      }
      
      // Fetch file content as text
      const response = await apiClient.get(file.path, {
        responseType: 'text'
      })
      
      setPreviewContent(response.data)
    } catch (error) {
      console.error('Preview failed:', error)
      setPreviewContent(`Failed to load preview: ${(error as ApiError)?.response?.status || 'Network error'}`)
    } finally {
      setPreviewLoading(false)
    }
  }

  const downloadFile = async (file: ArtifactFile) => {
    try {
      playClickSound()
      // Download from the artifact endpoint using the API client
      const response = await apiClient.get(file.path, {
        responseType: 'blob'
      })
      
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      showError(`Download failed: ${(error as ApiError)?.response?.status || 'Network error'}`)
    }
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
        
        {auditVerification && !auditVerification.verified && (
          <div className={styles.auditWarning}>
            <ShieldExclamationIcon className={styles.warningIcon} />
            <span className={styles.warningText}>
              {compromisedExecutionCount} execution{compromisedExecutionCount !== 1 ? 's' : ''} detected with compromised audit trail
            </span>
          </div>
        )}
        
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
            
            <select
              className={styles.filterSelect}
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value as 'all' | 'verified' | 'compromised')
                e.target.blur()
              }}
            >
              <option value="all">All Verification ({executions.length})</option>
              <option value="verified">Verified ({executions.length - compromisedExecutionCount})</option>
              <option value="compromised">Compromised ({compromisedExecutionCount})</option>
            </select>
            
            <span className={styles.resultCount}>
              {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
            </span>

          </div>
          
          <div className={styles.secondaryControls}>
            <div className={styles.dateGroup}>
              <label>From:</label>
              <div className={styles.dateInputWrapper}>
                <CalendarIcon className={styles.dateIcon} />
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.dateGroup}>
              <label>To:</label>
              <div className={styles.dateInputWrapper}>
                <CalendarIcon className={styles.dateIcon} />
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
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

      <div className={`${styles.layout} ${!selectedExecution ? styles.layoutFullWidth : ''}`}>
        <div className={styles.executionsList}>
          <Card>
            <h2 className={styles.alignedHeading}>Execution History</h2>
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
                    setActiveTab('overview') // Reset to overview when selecting new execution
                  }}
                >
                  <span className={styles.agentName}>
                    {compromisedThreadIds.has(execution.thread_id) ? (
                      <ShieldExclamationIcon className={styles.tamperedIcon} title="Chain compromised - execution tampered" />
                    ) : (
                      <ShieldCheckIcon className={styles.verifiedIcon} title="Cryptographically verified execution" />
                    )}
                    {execution.agent}
                  </span>
                  <span 
                    className={`${styles.status} ${getStatusClass(execution.state)}`}
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
          <div className={styles.executionDetail} data-tour="execution-detail-panel">
            <Card>
              <div className={styles.detailHeader}>
                <h2 className={styles.alignedHeading}>Execution Details</h2>
                <div className={styles.detailActions}>
                  {!!selectedExecution.payload && selectedExecution.state === 'failed' && (
                    <button
                      className="btn btn-sm btn-subtle"
                      onClick={() => {
                        playClickSound()
                        retryMutation.mutate(selectedExecution)
                      }}
                      disabled={retryMutation.isPending}
                      title={retryMutation.isPending ? 'Retrying...' : 'Retry execution'}
                    >
                      <ArrowPathIcon />
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-subtle"
                    onClick={() => {
                      playClickSound()
                      setSelectedExecution(null)
                    }}
                    title="Close details"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveTab('overview')
                    playClickSound()
                  }}
                >
                  Overview
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'artifacts' ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveTab('artifacts')
                    playClickSound()
                  }}
                  data-tour="artifacts-tab"
                >
                  Artifacts
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'data' ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveTab('data')
                    playClickSound()
                  }}
                >
                  Data
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveTab('audit')
                    playClickSound()
                  }}
                >
                  Audit
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className={styles.tabContent}>
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabHeading}>Execution Overview</h3>
                  </div>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <label>Thread ID</label>
                      <div className={styles.detailValueWithAction}>
                        <span className={styles.detailValue}>{selectedExecution.thread_id}</span>
                        <button
                          className="btn btn-icon btn-subtle"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedExecution.thread_id)
                            playClickSound()
                            setCopiedThreadId(selectedExecution.thread_id)
                            setTimeout(() => setCopiedThreadId(null), 2000)
                          }}
                          title="Copy thread ID to clipboard"
                        >
                          {copiedThreadId === selectedExecution.thread_id ? (
                            <CheckIcon />
                          ) : (
                            <DocumentDuplicateIcon />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <label>Agent</label>
                      <div className={styles.detailValueWithAction}>
                        <span className={styles.detailValue}>{selectedExecution.agent}</span>
                        <button
                          className="btn btn-icon btn-subtle"
                          onClick={() => {
                            navigate(`/agents/${selectedExecution.agent}`)
                            playClickSound()
                          }}
                          title="Go to agent details"
                        >
                          <ArrowTopRightOnSquareIcon />
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <label>State</label>
                      <span 
                        className={`${styles.detailValue} ${getStatusClass(selectedExecution.state)}`}
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
                </div>
              )}

              {activeTab === 'artifacts' && (
                <div className={styles.tabContent} data-tour="artifacts-panel">
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabHeading}>Execution Artifacts</h3>
                    <a
                      href="https://docs.agentsystems.ai/user-guide/artifacts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-ghost"
                      title="View documentation"
                    >
                      <QuestionMarkCircleIcon style={{ width: '1rem', height: '1rem' }} />
                      View Docs
                    </a>
                  </div>
                  {artifactsData && (artifactsData.input_files.length > 0 || artifactsData.output_files.length > 0) ? (
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <label>Input Files ({artifactsData.input_files.length})</label>
                        <div className={styles.detailValue}>
                          {artifactsData.input_files.length > 0 ? (
                            <div className={styles.filesList}>
                              {artifactsData.input_files.map(file => (
                                <div key={file.path} className={styles.fileItem}>
                                  {getFileIcon()}
                                  <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                  </div>
                                  <div className={styles.fileActions}>
                                    <button
                                      className="btn btn-sm btn-subtle"
                                      onClick={() => openPreview(file)}
                                      title="Preview file"
                                    >
                                      <EyeIcon />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-subtle"
                                      onClick={() => downloadFile(file)}
                                      title="Download file"
                                    >
                                      <ArrowDownTrayIcon />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <label>Output Files ({artifactsData.output_files.length})</label>
                        <div className={styles.detailValue}>
                          {artifactsData.output_files.length > 0 ? (
                            <div className={styles.filesList}>
                              {artifactsData.output_files.map(file => (
                                <div key={file.path} className={styles.fileItem}>
                                  {getFileIcon()}
                                  <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                  </div>
                                  <div className={styles.fileActions}>
                                    <button
                                      className="btn btn-sm btn-subtle"
                                      onClick={() => openPreview(file)}
                                      title="Preview file"
                                    >
                                      <EyeIcon />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-subtle"
                                      onClick={() => downloadFile(file)}
                                      title="Download file"
                                    >
                                      <ArrowDownTrayIcon />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No artifacts available for this execution</p>
                      <p className={styles.emptyHint}>
                        Artifacts include input and output files generated during execution
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'data' && (
                <div className={styles.tabContent}>
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabHeading}>Execution Data</h3>
                  </div>
                  <div className={styles.detailGrid}>
                    {!!selectedExecution.payload && (
                      <div className={styles.detailItem} data-content-type="payload">
                        <label>Request Payload</label>
                        <pre className={styles.detailValue}>
                          {(() => {
                            try {
                              // Handle both string and object payloads
                              const payload = typeof selectedExecution.payload === 'string' 
                                ? JSON.parse(selectedExecution.payload)
                                : selectedExecution.payload
                              return JSON.stringify(payload, null, 2) || 'null'
                            } catch {
                              return String(selectedExecution.payload)
                            }
                          })()}
                        </pre>
                      </div>
                    )}

                    {!!selectedExecution.result && (
                      <div className={styles.detailItem} data-content-type="result">
                        <label>Result</label>
                        <pre className={styles.detailValue}>
                          {(() => {
                            try {
                              // If result is a string, parse and beautify it
                              if (typeof selectedExecution.result === 'string') {
                                const parsed = JSON.parse(selectedExecution.result)
                                return JSON.stringify(parsed, null, 2) || 'null'
                              }
                              // If it's already an object, stringify it
                              return JSON.stringify(selectedExecution.result, null, 2) || 'null'
                            } catch {
                              // If parsing fails, display the raw string
                              return String(selectedExecution.result)
                            }
                          })()}
                        </pre>
                      </div>
                    )}

                    {!!selectedExecution.error && (
                      <div className={styles.detailItem} data-content-type="error">
                        <label>Error</label>
                        <pre className={styles.detailValue}>
                          {(() => {
                            try {
                              // If error is a string, parse and beautify it
                              if (typeof selectedExecution.error === 'string') {
                                const parsed = JSON.parse(selectedExecution.error)
                                return JSON.stringify(parsed, null, 2) || 'null'
                              }
                              // If it's already an object, stringify it
                              return JSON.stringify(selectedExecution.error, null, 2) || 'null'
                            } catch {
                              // If parsing fails, display the raw string
                              return String(selectedExecution.error)
                            }
                          })()}
                        </pre>
                      </div>
                    )}
                    {!selectedExecution.payload && !selectedExecution.result && !selectedExecution.error && (
                      <div className={styles.emptyState}>
                        <p>No execution data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className={styles.tabContent}>
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabHeading}>Audit Trail</h3>
                    <a
                      href="https://docs.agentsystems.ai/user-guide/audit-logs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-ghost"
                      title="View documentation"
                    >
                      <QuestionMarkCircleIcon style={{ width: '1rem', height: '1rem' }} />
                      View Docs
                    </a>
                  </div>
                  <div className={styles.auditSection}>
                    {/* All detail items in a single detailGrid for consistent spacing */}
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <label>Verification Status</label>
                        <span className={styles.detailValue}>
                          {auditVerification?.verified ? (
                            <>
                              <ShieldCheckIcon className={styles.verifiedIcon} />
                              Verified
                            </>
                          ) : (
                            <>
                              <ShieldExclamationIcon className={styles.compromisedIcon} />
                              Compromised
                            </>
                          )}
                        </span>
                      </div>
                      
                      {/* Show tampering alert as text between detail items if this execution is compromised */}
                      {compromisedThreadIds.has(selectedExecution.thread_id) && (
                        <div className={styles.tamperingAlert}>
                          <ShieldExclamationIcon className={styles.alertIcon} />
                          <div>
                            <strong>This execution has been tampered with</strong>
                            <p>The audit trail shows evidence of data modification or hash chain compromise.</p>
                          </div>
                        </div>
                      )}

                      {auditData && (
                        <>
                          <div className={styles.detailItem}>
                            <label>Previous Execution Hash</label>
                            <span className={styles.detailValue}>
                              {auditData.audit_trail?.[0]?.prev_hash || 'Genesis'}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <label>This Execution Hash</label>
                            <span className={styles.detailValue}>
                              {auditData.audit_trail?.[auditData.audit_trail.length - 1]?.entry_hash || 'N/A'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {auditData && (
                      <div className={styles.auditDetails}>
                        <h4 className={styles.auditSubheading}>
                          Detailed audit events ({auditData.audit_trail?.length || 0} entries)
                        </h4>
                        <div className={styles.auditEvents}>
                          {auditData.audit_trail?.map((entry: AuditEntry) => (
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
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className={styles.modalOverlay} onClick={() => setPreviewFile(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className={styles.previewFileName}>{previewFile.name}</span>
                <span className={styles.previewFileInfo}>
                  {formatFileSize(previewFile.size)} • {previewFile.type}
                </span>
              </div>
              <button
                className="btn btn-sm btn-subtle"
                onClick={() => setPreviewFile(null)}
                title="Close preview"
              >
                <XMarkIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              {previewLoading ? (
                <div className={styles.previewLoading}>Loading preview...</div>
              ) : (
                <pre className={styles.previewContent}>
                  {previewContent}
                </pre>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className="btn btn-sm"
                onClick={() => downloadFile(previewFile)}
              >
                <ArrowDownTrayIcon />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          index={index}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}