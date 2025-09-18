import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow, differenceInMilliseconds } from 'date-fns'
import { ChartBarIcon, DocumentTextIcon, BoltIcon, PowerIcon, ListBulletIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { agentsApi } from '@api/agents'
import { useConfigStore } from '@stores/configStore'
import { getAgentButtonText } from '@utils/agentHelpers'
import Card from '@components/common/Card'
import SystemStatusBanner from '@components/common/SystemStatusBanner'
import Toast from '@components/Toast'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import { useAuthStore } from '@stores/authStore'
import { sanitizeJsonString, rateLimiter } from '@utils/security'
import { API_DEFAULTS } from '@constants/app'
import type { InvocationResult, Execution } from '../types/api'
import styles from './AgentDetail.module.css'

export default function AgentDetail() {
  const { agentName } = useParams<{ agentName: string }>()
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showError } = useToast()
  const { gatewayUrl, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [invokePayload, setInvokePayload] = useState('{\n  "date": "March 15"\n}')
  const [invocationResult, setInvocationResult] = useState<InvocationResult | null>(null)
  const [pollingStatus, setPollingStatus] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const previousAgentState = useRef<string | undefined>()

  // Get agent state from agents list
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    refetchInterval: 5000,
  })

  const currentAgent = agentsData?.agents.find(a => a.name === agentName)
  
  
  // Get agent configuration for image/tag information
  const { getAgents } = useConfigStore()
  const agentConfigs = getAgents()
  const agentConfig = agentConfigs.find(c => c.name === agentName)

  // Watch for agent state changes and trigger metadata refresh
  useEffect(() => {
    const currentState = currentAgent?.state
    const previousState = previousAgentState.current

    // If agent just became running (lazy start completed)
    if (previousState && previousState !== 'running' && currentState === 'running') {
      // Agent just became running - refresh metadata after short delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['agent-metadata', agentName] })
      }, 1000) // 1 second delay to ensure endpoint is ready
    }

    // Update ref for next comparison
    previousAgentState.current = currentState
  }, [currentAgent?.state, queryClient, agentName])

  // Get execution history for this agent
  const { data: executionHistory } = useQuery({
    queryKey: ['agent-executions', agentName],
    queryFn: () => agentsApi.listExecutions({ agent: agentName, limit: 100 }),
    enabled: !!agentName,
    refetchInterval: (query) => {
      const executions = query.state.data?.executions || []
      const hasRunning = executions.some((e: Execution) => e.state === 'running' || e.state === 'queued')
      return hasRunning ? API_DEFAULTS.EXECUTIONS_FAST_INTERVAL : API_DEFAULTS.EXECUTIONS_SLOW_INTERVAL
    },
  })

  // Live timer for running executions
  useEffect(() => {
    const interval = setInterval(() => {
      const executions = executionHistory?.executions || []
      const hasRunning = executions.some((e: Execution) => e.state === 'running')
      if (hasRunning) {
        setCurrentTime(new Date())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [executionHistory?.executions])

  // Calculate agent-specific performance metrics
  const performanceMetrics = (() => {
    if (!executionHistory?.executions) {
      return {
        totalExecutions: 0,
        successRate: 0,
        avgResponseTime: 0,
        recentExecutions: 0,
        failureRate: 0
      }
    }

    const executions = executionHistory.executions
    const total = executions.length
    const completed = executions.filter((e: Execution) => e.state === 'completed').length
    const failed = executions.filter((e: Execution) => e.state === 'failed').length

    // Calculate executions in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentExecutions = executions.filter((e: Execution) => 
      new Date(e.created_at) > oneDayAgo
    ).length

    // Calculate average response time for completed executions
    const responseTimes = executions
      .filter((e: Execution) => e.state === 'completed' && e.started_at && e.ended_at)
      .map((e: Execution) => differenceInMilliseconds(new Date(e.ended_at!), new Date(e.started_at!)))

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
      : 0

    return {
      totalExecutions: total,
      successRate: total > 0 ? (completed / (completed + failed)) * 100 : 0,
      avgResponseTime,
      recentExecutions,
      failureRate: total > 0 ? (failed / (completed + failed)) * 100 : 0
    }
  })()

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const { data: metadata, isLoading: metadataLoading, error: metadataError } = useQuery({
    queryKey: ['agent-metadata', agentName, currentAgent?.state],
    queryFn: () => agentsApi.getMetadata(agentName!),
    enabled: !!agentName && currentAgent?.state === 'running',
    retry: 3, // Increased retries for newly started agents
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    refetchInterval: false, // Metadata is static - only refetch on agent state change
    staleTime: Infinity, // Cache metadata until query key changes (agent state)
  })

  const invokeMutation = useMutation({
    mutationFn: ({ payload, files }: { payload: Record<string, unknown>, files?: File[] }) => {
      if (files && files.length > 0) {
        const formData = new FormData()
        formData.append('json', JSON.stringify(payload))
        files.forEach(file => formData.append('file', file))
        return agentsApi.uploadAndInvoke(agentName!, formData)
      } else {
        return agentsApi.invoke(agentName!, payload)
      }
    },
    onMutate: () => {
      // Invalidate agents query since invocation might trigger agent startup
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onSuccess: async (response) => {
      // Immediately refresh executions to show the new running execution
      queryClient.invalidateQueries({ queryKey: ['agent-executions', agentName] })
      queryClient.invalidateQueries({ queryKey: ['executions'] })
      
      // Poll for status with proper error handling and timeout
      const pollStatus = async (attempts = 0) => {
        const maxAttempts = 120 // 2 minutes max polling
        
        if (attempts >= maxAttempts) {
          setPollingStatus('')
          setInvocationResult({
            thread_id: response.thread_id,
            error: {
              message: 'Invocation timed out - check agent logs for details',
              status: 408
            }
          })
          return
        }

        try {
          const status = await agentsApi.getStatus(response.thread_id)
          
          // Update polling status for user feedback
          setPollingStatus(`Status: ${status.state}${status.progress?.message ? ` - ${status.progress.message}` : ''} (${attempts + 1}/${maxAttempts})`)
          
          if (status.state === 'completed') {
            setPollingStatus('Getting results...')
            const result = await agentsApi.getResult(response.thread_id)
            setPollingStatus('')
            setInvocationResult(result)
            
            // Refresh agents list since invocation completed
            queryClient.invalidateQueries({ queryKey: ['agents'] })
          } else if (status.state === 'failed') {
            setPollingStatus('')
            setInvocationResult({
              thread_id: response.thread_id,
              error: status.error || {
                message: 'Agent invocation failed',
                status: 500
              }
            })
          } else if (status.state === 'running' || status.state === 'queued') {
            // Continue polling
            setTimeout(() => pollStatus(attempts + 1), 1000)
          }
        } catch (error) {
          console.error('Error polling status:', error)
          setPollingStatus('')
          setInvocationResult({
            thread_id: response.thread_id,
            error: {
              message: `Failed to get invocation status: ${error instanceof Error ? error.message : 'Unknown error'}`,
              status: 500
            }
          })
        }
      }
      
      pollStatus()
    },
    onError: (error) => {
      console.error('Invocation failed:', error)
      setPollingStatus('')
      setInvocationResult({
        thread_id: '',
        error: {
          message: `Failed to invoke agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 500
        }
      })
    }
  })

  const startMutation = useMutation({
    mutationFn: agentsApi.startAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agent-metadata', agentName] })
    },
    onError: (error) => {
      console.error('Failed to start agent:', error)
      showError(`Failed to start agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const stopMutation = useMutation({
    mutationFn: agentsApi.stopAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agent-metadata', agentName] })
    },
    onError: (error) => {
      console.error('Failed to stop agent:', error)
      showError(`Failed to stop agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const handleInvoke = () => {
    playClickSound()
    
    // Clear previous results and status
    setInvocationResult(null)
    setPollingStatus('')
    
    // Rate limiting to prevent spam
    if (!rateLimiter.isAllowed('agent-invoke', 10, 60000)) {
      showError('Too many invocation attempts. Please wait a moment before trying again.')
      return
    }
    
    try {
      // Sanitize JSON input before parsing
      const sanitizedPayload = sanitizeJsonString(invokePayload)
      const payload = JSON.parse(sanitizedPayload)
      
      
      // Update UI with sanitized payload if it was changed
      if (sanitizedPayload !== invokePayload) {
        setInvokePayload(sanitizedPayload)
      }
      
      invokeMutation.mutate({ payload, files: selectedFiles })
    } catch (error) {
      console.error('Invalid JSON payload:', error)
      showError('Invalid JSON format. Please check your payload.')
    }
  }

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1>{agentName}</h1>
        </div>
        <p className={styles.subtitle}>
          Agent details and invocation
        </p>
      </div>

      {currentAgent && (
          <>
            <SystemStatusBanner
              status={currentAgent.state === 'running' ? 'healthy' : 'warning'}
              title="Agent Status"
              message={`Agent is currently ${currentAgent.state === 'running' ? 'running and ready for requests' : currentAgent.state === 'stopped' ? 'stopped but will auto-start on first request' : 'not created yet'}`}
              data-tour="agent-status-banner"
            />
            
            <div className={styles.agentControls}>
              {currentAgent.state === 'stopped' || currentAgent.state === 'not-created' ? (
                <button
                  className="btn btn-sm btn-subtle btn-success-color"
                  onClick={() => {
                    playClickSound()
                    startMutation.mutate(agentName!)
                  }}
                  disabled={startMutation.isPending}
                  data-tour="start-agent-button"
                >
                  <PowerIcon />
                  {startMutation.isPending || invokeMutation.isPending ? 'Turning On...' : getAgentButtonText(currentAgent.state)}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-subtle btn-danger-color"
                  onClick={() => {
                    playClickSound()
                    stopMutation.mutate(agentName!)
                  }}
                  disabled={stopMutation.isPending}
                >
                  <PowerIcon />
                  {stopMutation.isPending ? 'Turning Off...' : getAgentButtonText(currentAgent.state)}
                </button>
              )}
            </div>
          </>
        )}

      <div className={styles.grid}>
        <Card>
          <h2>Agent Information</h2>
          
          {/* Container/Image Information from config */}
          {agentConfig && (
            <div className={styles.configSection}>
              <h3 className={styles.sectionHeader}>Container Image</h3>
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <label>Repository</label>
                  <span className={styles.metadataValue}>{agentConfig.repo}</span>
                </div>
                <div className={styles.metadataItem}>
                  <label>Tag</label>
                  <span className={styles.metadataValue}>{agentConfig.tag}</span>
                </div>
                <div className={styles.metadataItem}>
                  <label>Full Image</label>
                  <span className={styles.metadataValue}>{agentConfig.repo}:{agentConfig.tag}</span>
                </div>
              </div>
            </div>
          )}
          
          {currentAgent && (currentAgent.state === 'stopped' || currentAgent.state === 'not-created') ? (
            <div className={styles.unavailableState}>
              <div className={styles.placeholderIcon}>
                <ChartBarIcon />
              </div>
              <p>Agent metadata unavailable</p>
              <p className={styles.placeholderHint}>
                Turn the agent on to view detailed information
              </p>
            </div>
          ) : metadataLoading ? (
            <div className={styles.loadingState}>
              Loading agent metadata...
            </div>
          ) : metadataError ? (
            <div className={styles.errorState}>
              <p>Failed to load agent metadata</p>
              <p className={styles.errorDetails}>
                {metadataError instanceof Error ? metadataError.message : 'Unknown error'}
              </p>
            </div>
          ) : metadata ? (
            <div className={styles.runtimeSection} data-tour="agent-metadata">
              <h3 className={styles.sectionHeader}>Runtime Metadata</h3>
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <label>Name</label>
                  <span className={styles.metadataValue}>{metadata.name}</span>
                </div>
              
              <div className={styles.metadataItem}>
                <label>Namespace</label>
                <span className={styles.metadataValue}>{metadata.namespace}</span>
              </div>
              
              <div className={styles.metadataItem}>
                <label>Version</label>
                <span className={styles.metadataValue}>{metadata.version}</span>
              </div>
              
              <div className={styles.metadataItem}>
                <label>Description</label>
                <span className={styles.metadataValue}>{metadata.description}</span>
              </div>
              
              {metadata.model_dependencies && metadata.model_dependencies.length > 0 && (
                <div className={styles.metadataItem}>
                  <label>Model Dependencies</label>
                  <div className={styles.modelDependencies}>
                    {metadata.model_dependencies.map((model, index) => (
                      <span key={index} className={styles.modelTag}>
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {metadata.author && (
                <div className={styles.metadataItem}>
                  <label>Author</label>
                  <span className={styles.metadataValue}>{metadata.author}</span>
                </div>
              )}
              
              {metadata.tags && metadata.tags.length > 0 && (
                <div className={styles.metadataItem}>
                  <label>Tags</label>
                  <div className={styles.tags}>
                    {metadata.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {metadata.capabilities && metadata.capabilities.length > 0 && (
                <div className={styles.metadataItem}>
                  <label>Capabilities</label>
                  <div className={styles.capabilities}>
                    {metadata.capabilities.map((capability, index) => (
                      <span key={index} className={styles.capability}>
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          ) : (
            <div className={styles.errorState}>
              <p>No metadata available</p>
              <p className={styles.errorDetails}>
                Agent may not be running or doesn't expose metadata
              </p>
            </div>
          )}
          
          <div className={styles.documentationLinks}>
            {currentAgent?.state === 'running' ? (
              <a 
                href={`${gatewayUrl}/${agentName}/docs`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-subtle"
                title="View interactive API documentation"
              >
                <DocumentTextIcon className={styles.docIcon} />
                View API Documentation
              </a>
            ) : (
              <button 
                className="btn btn-sm btn-subtle"
                disabled
                title="Start the agent to view API documentation"
              >
                <DocumentTextIcon className={styles.docIcon} />
                View API Documentation
              </button>
            )}
            
            {currentAgent?.state === 'running' ? (
              <div className={styles.rawMetadata}>
                <h4>Raw Metadata (JSON)</h4>
                {metadataLoading ? (
                  <div className={styles.metadataLoading}>
                    <p>Loading metadata...</p>
                    <p className={styles.loadingHint}>Agent just started - metadata endpoint is initializing</p>
                  </div>
                ) : metadataError ? (
                  <div className={styles.metadataError}>
                    <p>Metadata not yet available</p>
                    <p className={styles.errorHint}>Agent may still be starting up</p>
                  </div>
                ) : (
                  <pre className={styles.metadata}>
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className={styles.disabledNote}>
                <p>
                  <strong>API documentation and metadata are only available when the agent is running.</strong>
                </p>
                <p>Start the agent container to access interactive documentation and detailed metadata.</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2>Execute Agent</h2>
          <p className={styles.instructions}>
            Enter a JSON payload to execute the agent.
          </p>
          <div className={styles.invokeForm}>
            <label>
              Payload (JSON):
              <textarea
                className={styles.payloadInput}
                value={invokePayload}
                onChange={(e) => setInvokePayload(e.target.value)}
                rows={10}
                placeholder='{"message": "Hello, agent!"}'
              />
            </label>

            <div className={styles.fileUpload}>
              <label>
                Files (optional):
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className={styles.fileInput}
                />
              </label>
              {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                  <h4>Selected files:</h4>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
                        <button 
                          type="button"
                          onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                          className={styles.removeFile}
                          aria-label={`Remove ${file.name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            
            <button
              className="btn btn-lg btn-bright"
              onClick={handleInvoke}
              disabled={!isAuthenticated() || invokeMutation.isPending || !!pollingStatus}
              title={!isAuthenticated() ? 'Auth token required - configure in Configuration > Gateway Connection' : undefined}
              data-tour="execute-agent-button"
            >
              <BoltIcon className={styles.executeIcon} />
              {!isAuthenticated() ? 'Auth Required' : invokeMutation.isPending ? 'Executing...' : pollingStatus ? 'Running...' : 'Execute'}
            </button>

            {!isAuthenticated() && (
              <div className={styles.authWarning}>
                <ExclamationTriangleIcon className={styles.warningIcon} />
                <div className={styles.warningContent}>
                  <p>Authentication token required to execute agents</p>
                  <p>
                    Configure your auth token in{' '}
                    <a href="/configuration/connection" className={styles.configLink}>
                      Configuration → Gateway Connection
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Status/Results area - always present for tour anchoring */}
            {pollingStatus && (
              <div className={styles.statusIndicator} data-tour="execution-status">
                <div className={styles.spinner}></div>
                <span>{pollingStatus}</span>
              </div>
            )}

            {/* Results container - visible when we have results or are waiting */}
            <div
              className={styles.result}
              data-tour="execution-results-container"
              style={{ display: invocationResult ? 'block' : 'none' }}
            >
              {invocationResult && (
                <>
                  {invocationResult.error ? (
                    <div className={styles.error}>
                      <h3>Error:</h3>
                      <div className={styles.errorMessage}>
                        {invocationResult.error.message}
                        {invocationResult.error.status && (
                          <span className={styles.errorCode}> (Status: {invocationResult.error.status})</span>
                        )}
                      </div>
                      {invocationResult.error.body && (
                        <details className={styles.errorDetails}>
                          <summary>Error Details</summary>
                          <pre>{invocationResult.error.body}</pre>
                        </details>
                      )}
                    </div>
                  ) : (
                    <div className={styles.success}>
                      <h3>Result:</h3>
                      <pre data-tour="execution-results">{
                        (() => {
                          try {
                            // If it's a string, try to parse and beautify it
                            if (typeof invocationResult.result === 'string') {
                              const parsed = JSON.parse(invocationResult.result)
                              return JSON.stringify(parsed, null, 2)
                            }
                            // If it's already an object, stringify it
                            return JSON.stringify(invocationResult.result, null, 2)
                          } catch {
                            // If parsing fails, display the raw string
                            return invocationResult.result as string
                          }
                        })()
                      }</pre>
                    </div>
                  )}
                  <div className={styles.threadInfo}>
                    <small>Thread ID: {invocationResult.thread_id}</small>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Executions */}
      {executionHistory?.executions && executionHistory.executions.length > 0 && (
        <Card className={styles.sectionCard}>
          <div className={styles.executionHistoryHeader}>
            <h2>Recent Executions</h2>
            <button 
              className="btn btn-sm btn-subtle"
              onClick={() => {
                playClickSound()
                window.open(`/executions?agent=${agentName}`, '_blank')
              }}
            >
              <ListBulletIcon />
              View All
            </button>
          </div>
          
          <div className={styles.executionsTable} data-tour="executions-table">
            <div className={styles.tableHeader}>
              <span>Status</span>
              <span>Started</span>
              <span>Duration</span>
              <span>Thread ID</span>
            </div>
            
            {executionHistory.executions.slice(0, 5).map((execution: Execution, index: number) => (
              <div
                key={execution.thread_id}
                className={styles.executionRow}
                onClick={() => {
                  playClickSound()
                  navigate(`/executions?thread=${execution.thread_id}`)
                }}
                data-tour={index === 0 ? 'execution-row-first' : undefined}
              >
                <span 
                  className={`${styles.status} ${
                    execution.state === 'completed' ? styles.statusCompleted :
                    execution.state === 'failed' ? styles.statusFailed :
                    execution.state === 'running' ? styles.statusRunning : styles.statusQueued
                  }`}
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
                  {(() => {
                    if (!execution.started_at) return '—'
                    const start = new Date(execution.started_at)
                    const end = execution.ended_at ? new Date(execution.ended_at) : currentTime
                    const duration = Math.round((end.getTime() - start.getTime()) / 1000)
                    return duration < 60 ? `${duration}s` : `${Math.round(duration / 60)}m ${duration % 60}s`
                  })()}
                </span>
                <span className={styles.threadId}>
                  {execution.thread_id.substring(0, 8)}...
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Metrics Card - placed after executions */}
      {performanceMetrics.totalExecutions > 0 && (
        <Card className={styles.sectionCard}>
          <h2>Performance Metrics</h2>
          <div className={styles.performanceGrid}>
            <div className={styles.performanceMetric}>
              <BoltIcon className={styles.performanceIcon} />
              <div className={styles.performanceData}>
                <div className={styles.performanceValue}>{performanceMetrics.totalExecutions}</div>
                <div className={styles.performanceLabel}>Total Executions</div>
                <div className={styles.performanceSubtext}>
                  {performanceMetrics.recentExecutions} in last 24h
                </div>
              </div>
            </div>

            <div className={styles.performanceMetric}>
              <CheckCircleIcon className={styles.performanceIcon} />
              <div className={styles.performanceData}>
                <div 
                  className={`${styles.performanceValue} ${
                    performanceMetrics.successRate >= 95 ? styles.performanceSuccess :
                    performanceMetrics.successRate >= 80 ? styles.performanceWarning : styles.performanceError
                  }`}
                >
                  {performanceMetrics.successRate.toFixed(1)}%
                </div>
                <div className={styles.performanceLabel}>Success Rate</div>
                <div className={styles.performanceSubtext}>
                  {performanceMetrics.failureRate > 0 && 
                    `${performanceMetrics.failureRate.toFixed(1)}% failures`
                  }
                </div>
              </div>
            </div>

            <div className={styles.performanceMetric}>
              <ClockIcon className={styles.performanceIcon} />
              <div className={styles.performanceData}>
                <div className={styles.performanceValue}>
                  {formatDuration(performanceMetrics.avgResponseTime)}
                </div>
                <div className={styles.performanceLabel}>Avg Response Time</div>
                <div className={styles.performanceSubtext}>
                  Per execution
                </div>
              </div>
            </div>
          </div>
        </Card>
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