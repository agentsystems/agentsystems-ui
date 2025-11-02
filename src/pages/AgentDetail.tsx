import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow, differenceInMilliseconds } from 'date-fns'
import { BoltIcon, PowerIcon, ListBulletIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, UserIcon, BriefcaseIcon, MapPinIcon, CalendarIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, IdentificationIcon, EnvelopeIcon, BookOpenIcon, LightBulbIcon, FolderIcon, HandRaisedIcon, HeartIcon, LinkIcon, UserGroupIcon, GlobeAltIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
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

// Developer info interface for modal
interface DeveloperInfo {
  id: string
  name: string
  avatar_url: string | null
  agent_count: number
  // Profile fields
  bio?: string | null
  tagline?: string | null
  developer_type?: string | null
  company?: string | null
  location?: string | null
  years_experience?: number | null
  // Contact & Links
  website?: string | null
  support_email?: string | null
  documentation_url?: string | null
  // Social
  github_username?: string | null
  twitter_handle?: string | null
  linkedin_url?: string | null
  discord_username?: string | null
  // Professional
  expertise?: string[] | null
  featured_work?: string[] | null
  open_to_collaboration?: boolean | null
  sponsor_url?: string | null
}

export default function AgentDetail() {
  const { agentName } = useParams<{ agentName: string }>()
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showError } = useToast()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [invokePayload, setInvokePayload] = useState('{}')
  const [invocationResult, setInvocationResult] = useState<InvocationResult | null>(null)
  const [pollingStatus, setPollingStatus] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const previousAgentState = useRef<string | undefined>()

  // Smart form state
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [jsonParseError, setJsonParseError] = useState<string | null>(null)

  // Metadata collapse state
  const [isMetadataCollapsed, setIsMetadataCollapsed] = useState(true)

  // Developer modal state
  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperInfo | null>(null)
  const [isDeveloperLoading, setIsDeveloperLoading] = useState(false)
  const [developerAgents, setDeveloperAgents] = useState<Array<{
    id: string
    name: string
    description: string
    _index_name?: string
  }>>([])
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)

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

  // Get metadata (from index or declared in config)
  const metadata = agentConfig?.index_metadata || agentConfig?.declared_metadata

  // Track previous agent state for UI updates
  useEffect(() => {
    previousAgentState.current = currentAgent?.state
  }, [currentAgent?.state])

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

  // Initialize form values and JSON payload from input schema when metadata becomes available
  useEffect(() => {
    if (metadata?.input_schema && Object.keys(metadata.input_schema).length > 0) {
      // Generate initial values from schema
      const initialValues: Record<string, unknown> = {}

      Object.entries(metadata.input_schema).forEach(([fieldName, fieldConfig]: [string, unknown]) => {
        // Only pre-populate required fields with empty values
        const config = fieldConfig as { required?: boolean; type?: string }
        if (config.required) {
          const fieldType = config.type?.toLowerCase() || 'string'

          if (fieldType === 'boolean') {
            initialValues[fieldName] = false
          } else if (fieldType === 'integer' || fieldType === 'number') {
            // Leave numeric fields empty for user to fill
            // Don't set a default value
          } else {
            initialValues[fieldName] = ''
          }
        }
      })

      setFormValues(initialValues)
      setInvokePayload(JSON.stringify(initialValues, null, 2))
      setJsonParseError(null)
    }
  }, [metadata?.input_schema])

  // Handle form field changes - update form state and JSON textarea
  const handleFormFieldChange = (fieldName: string, value: unknown) => {
    const newFormValues = { ...formValues, [fieldName]: value }
    setFormValues(newFormValues)

    // Update JSON textarea
    try {
      const jsonString = JSON.stringify(newFormValues, null, 2)
      setInvokePayload(jsonString)
      setJsonParseError(null)
    } catch (e) {
      setJsonParseError((e as Error).message)
    }
  }

  // Handle JSON textarea changes - update form state
  const handleJsonChange = (jsonString: string) => {
    setInvokePayload(jsonString)

    try {
      const parsed = JSON.parse(jsonString)
      setFormValues(parsed)
      setJsonParseError(null)
    } catch (e) {
      // Don't update form values if JSON is invalid, but keep the error
      setJsonParseError((e as Error).message)
    }
  }

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
        const maxAttempts = 7200 // Max 2 hours (most agents complete in seconds/minutes; matches gateway timeout)
        
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

          // Update polling status for user feedback - show elapsed time and max timeout
          const elapsedSeconds = attempts + 1
          const elapsedMinutes = Math.floor(elapsedSeconds / 60)
          const elapsedTime = elapsedMinutes > 0
            ? `${elapsedMinutes}m ${elapsedSeconds % 60}s`
            : `${elapsedSeconds}s`
          setPollingStatus(`Status: ${status.state}${status.progress?.message ? ` - ${status.progress.message}` : ''} (${elapsedTime} / max 2h)`)
          
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
      // Metadata comes from config, not affected by agent state
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
      // Metadata comes from config, not affected by agent state
    },
    onError: (error) => {
      console.error('Failed to stop agent:', error)
      showError(`Failed to stop agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const handleDeveloperClick = async (developerName: string) => {
    // Check if agent has index source labels to determine index URL
    const indexSourceId = agentConfig?.labels?.['index.source.agent.id']

    if (!indexSourceId) {
      showError('Developer profile unavailable for local agents. This feature requires an agent from an index.')
      return
    }

    // Get the index URL from config
    const { getIndexConnections } = useConfigStore.getState()
    const indexes = getIndexConnections()
    const enabledIndexes = indexes.filter(idx => idx.enabled)

    if (enabledIndexes.length === 0) {
      showError('No enabled index connections found.')
      return
    }

    // For now, try the first enabled index - in production you'd want to track which index the agent came from
    const indexUrl = enabledIndexes[0].url
    const fetchUrl = `${indexUrl}/developers/${developerName}`

    // Show modal immediately with placeholder data
    const placeholderInfo: DeveloperInfo = {
      id: '',
      name: developerName,
      avatar_url: null,
      agent_count: 1
    }

    setSelectedDeveloper(placeholderInfo)
    setIsDeveloperLoading(true)
    setDeveloperAgents([])
    setIsLoadingAgents(true)

    try {
      // Fetch developer info and agents list in parallel
      const [developerResponse, agentsResponse] = await Promise.all([
        fetch(fetchUrl),
        fetch(`${indexUrl}/agents`)
      ])

      // Handle developer response
      if (!developerResponse.ok) {
        const errorText = await developerResponse.text()
        console.error('Developer fetch failed:', developerResponse.status, errorText)
        throw new Error(`Failed to fetch developer info: ${developerResponse.status}`)
      }

      const developerData = await developerResponse.json()
      setSelectedDeveloper(developerData)

      // Handle agents response
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()

        // Filter agents by this developer
        const developerAgentsList = (agentsData.agents || [])
          .filter((agent: { developer: { name: string } }) => agent.developer.name === developerName)
          .map((agent: { id: string; name: string; description: string }) => ({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            _index_name: enabledIndexes[0].name
          }))

        setDeveloperAgents(developerAgentsList)
      } else {
        console.warn('Failed to fetch agents list:', agentsResponse.status)
      }
    } catch (err) {
      console.error('Error fetching developer:', err)
      showError(`Failed to load developer profile: ${err instanceof Error ? err.message : 'Unknown error'}`)
      // Keep the placeholder data
    } finally {
      setIsDeveloperLoading(false)
      setIsLoadingAgents(false)
    }
  }

  // Check if all requirements are met to enable execute button
  const checkRequirements = (): { canExecute: boolean; missingRequirements: string[]; warnings?: string[] } => {
    const missing: string[] = []

    // Use the metadata from component scope (already has fallback logic)
    if (!metadata) {
      // No metadata available - allow execution but warn
      return {
        canExecute: true,
        missingRequirements: [],
        warnings: ['Agent metadata unavailable - requirements cannot be verified. Execution may fail if dependencies are not configured.']
      }
    }

    const { getModelConnections, getEnvVars } = useConfigStore.getState()
    const modelConnections = getModelConnections()
    const envVars = getEnvVars()

    // Check model dependencies
    if (metadata.model_dependencies && metadata.model_dependencies.length > 0) {
      const configuredModels = new Set(modelConnections.filter(m => m.enabled).map(m => m.model_id))
      const missingModels = metadata.model_dependencies.filter(model => !configuredModels.has(model))
      if (missingModels.length > 0) {
        missing.push(`Models: ${missingModels.join(', ')}`)
      }
    }

    // Check required credentials
    if (metadata.required_credentials && metadata.required_credentials.length > 0) {
      const configuredEnvVars = new Set(envVars.map(v => v.key))
      const missingCreds = metadata.required_credentials.filter(cred => !configuredEnvVars.has(cred.name))
      if (missingCreds.length > 0) {
        missing.push(`Credentials: ${missingCreds.map(c => c.name).join(', ')}`)
      }
    }

    // Check required egress URLs are in egress_allowlist
    if (metadata.required_egress && metadata.required_egress.length > 0) {
      const allowlistStr = agentConfig.egressAllowlist || ''
      const allowlist = new Set(
        allowlistStr
          .split(',')
          .map(url => url.trim())
          .filter(url => url.length > 0)
      )
      const missingEgress = metadata.required_egress.filter(url => !allowlist.has(url))
      if (missingEgress.length > 0) {
        missing.push(`Network access: ${missingEgress.join(', ')}`)
      }
    }

    // Check required input fields
    if (metadata.input_schema) {
      const requiredFields = Object.entries(metadata.input_schema)
        .filter(([, config]) => (config as { required?: boolean }).required)
        .map(([name]) => name)

      const missingFields = requiredFields.filter(field => {
        const value = formValues[field]
        return value === undefined || value === null || value === ''
      })

      if (missingFields.length > 0) {
        missing.push(`Required fields: ${missingFields.join(', ')}`)
      }
    }

    return { canExecute: missing.length === 0, missingRequirements: missing }
  }

  const requirementStatus = checkRequirements()

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

      {/* Performance Metrics Card - placed at top full width */}
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

      <div className={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

          {metadata ? (
            <div className={styles.runtimeSection} data-tour="agent-metadata">
              <div
                className={styles.sectionHeaderWithBadge}
                onClick={() => setIsMetadataCollapsed(!isMetadataCollapsed)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isMetadataCollapsed ? (
                    <ChevronDownIcon style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <ChevronUpIcon style={{ width: '20px', height: '20px' }} />
                  )}
                  <h3 className={styles.sectionHeader} style={{ margin: 0 }}>Agent Information</h3>
                </div>
                <span className={styles.metadataSourceBadge} title="Metadata from agent-index cached in config">
                  From agent-index
                </span>
              </div>

              {!isMetadataCollapsed && (
                <>
              {/* Core Identity Section */}
              <div className={styles.metadataSection}>
                <h4 className={styles.subsectionHeader}>Core Identity</h4>
                <div className={styles.metadataGrid}>
                  <div className={styles.metadataItem}>
                    <label>Name</label>
                    <span className={styles.metadataValue}>{agentConfig.name}</span>
                  </div>

                  {agentConfig.labels?.['index.source.agent.developer'] && (
                    <div className={styles.metadataItem}>
                      <label>Developer</label>
                      <button
                        className={styles.developerButton}
                        onClick={() => handleDeveloperClick(agentConfig.labels?.['index.source.agent.developer'] ?? '')}
                        title={agentConfig?.labels?.['index.source.agent.id'] ? 'Click to view developer profile' : 'Developer profile unavailable (local agent)'}
                        disabled={!agentConfig?.labels?.['index.source.agent.id']}
                      >
                        {agentConfig.labels?.['index.source.agent.developer']}
                      </button>
                    </div>
                  )}

                  <div className={styles.metadataItem}>
                    <label>Version</label>
                    <span className={styles.metadataValue}>{agentConfig.tag}</span>
                  </div>

                  {metadata.description && (
                    <div className={styles.metadataItem}>
                      <label>Description</label>
                      <span className={styles.metadataValue}>{metadata.description}</span>
                    </div>
                  )}

                  {metadata.source_repository_url && (
                    <div className={styles.metadataItem}>
                      <label>Source Repository</label>
                      <a
                        href={metadata.source_repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.metadataValue}
                        style={{ color: 'var(--primary)' }}
                      >
                        {metadata.source_repository_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Discovery & Classification Section */}
              {(Boolean(metadata.facets?.context) || metadata.readiness_level) && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Discovery & Classification</h4>
                  <div className={styles.metadataGrid}>
                    {Boolean(metadata.facets?.context) && (
                      <div className={styles.metadataItem}>
                        <label>Context</label>
                        <span className={styles.badge}>{String(metadata.facets?.context)}</span>
                      </div>
                    )}

                    {Boolean(metadata.facets?.autonomy) && (
                      <div className={styles.metadataItem}>
                        <label>Autonomy</label>
                        <span className={styles.badge}>{String(metadata.facets?.autonomy)}</span>
                      </div>
                    )}

                    {metadata.readiness_level && (
                      <div className={styles.metadataItem}>
                        <label>Readiness Level</label>
                        <span className={styles.badge}>{metadata.readiness_level}</span>
                      </div>
                    )}

                    {Boolean(metadata.facets?.latency) && (
                      <div className={styles.metadataItem}>
                        <label>Latency</label>
                        <span className={styles.badge}>{String(metadata.facets?.latency)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Model Dependencies Section */}
              {metadata.model_dependencies && metadata.model_dependencies.length > 0 && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Model Dependencies</h4>
                  <div className={styles.modelDependencies}>
                    {metadata.model_dependencies.map((model, index) => (
                      <span key={index} className={styles.modelTag}>
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Network Access Section */}
              {metadata.required_egress && metadata.required_egress.length > 0 && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Required Network Access</h4>
                  <ul className={styles.egressList}>
                    {metadata.required_egress.map((url, index) => (
                      <li key={index}>
                        <code>{url}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Input Schema Section */}
              {metadata.input_schema && Object.keys(metadata.input_schema).length > 0 && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Input Parameters</h4>
                  <div className={styles.inputSchemaList}>
                    {Object.entries(metadata.input_schema).map(([fieldName, fieldConfig]) => {
                      const config = fieldConfig as { required?: boolean; type?: string; label?: string; description?: string }
                      return (
                        <div key={fieldName} className={styles.schemaField}>
                          <div className={styles.schemaFieldHeader}>
                            <code className={styles.fieldName}>{fieldName}</code>
                            <span className={config.required ? styles.requiredBadge : styles.optionalBadge}>
                              {config.required ? 'required' : 'optional'}
                            </span>
                          </div>
                          {config.label && (
                            <div className={styles.schemaFieldLabel}>{config.label}</div>
                          )}
                          {config.description && (
                            <div className={styles.schemaFieldDescription}>{config.description}</div>
                          )}
                          {config.type && (
                            <div className={styles.schemaFieldType}>Type: {config.type}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Facets Section */}
              {metadata.facets && Object.keys(metadata.facets).length > 0 && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Agent Characteristics (Facets)</h4>
                  <div className={styles.facetsGrid}>
                    {/* Autonomy */}
                    {(metadata.facets.autonomy as string | undefined) && (
                      <div className={styles.metadataItem}>
                        <label>Autonomy Level</label>
                        <span className={styles.badge}>{String(metadata.facets.autonomy)}</span>
                      </div>
                    )}

                    {/* Latency */}
                    {(metadata.facets.latency as string | undefined) && (
                      <div className={styles.metadataItem}>
                        <label>Latency</label>
                        <span className={styles.badge}>{String(metadata.facets.latency)}</span>
                      </div>
                    )}

                    {/* Cost Profile */}
                    {(metadata.facets.cost_profile as string | undefined) && (
                      <div className={styles.metadataItem}>
                        <label>Cost Profile</label>
                        <span className={styles.badge}>{String(metadata.facets.cost_profile)}</span>
                      </div>
                    )}

                    {/* Domains */}
                    {Array.isArray(metadata.facets.domains) && metadata.facets.domains.length > 0 && (
                      <div className={styles.metadataItem}>
                        <label>Domains</label>
                        <div className={styles.tagList}>
                          {(metadata.facets.domains as string[]).map((domain, index) => (
                            <span key={index} className={styles.tag}>{domain}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modalities */}
                    {Array.isArray(metadata.facets.modalities) && metadata.facets.modalities.length > 0 && (
                      <div className={styles.metadataItem}>
                        <label>Modalities</label>
                        <div className={styles.tagList}>
                          {(metadata.facets.modalities as string[]).map((modality, index) => (
                            <span key={index} className={styles.tag}>{modality}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Model Tooling */}
                    {Array.isArray(metadata.facets.model_tooling) && metadata.facets.model_tooling.length > 0 && (
                      <div className={styles.metadataItem}>
                        <label>Model Tooling</label>
                        <div className={styles.tagList}>
                          {(metadata.facets.model_tooling as string[]).map((tool, index) => (
                            <span key={index} className={styles.tag}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Industries */}
                    {Array.isArray(metadata.facets.industries) && metadata.facets.industries.length > 0 && (
                      <div className={styles.metadataItem}>
                        <label>Industries</label>
                        <div className={styles.tagList}>
                          {(metadata.facets.industries as string[]).map((industry, index) => (
                            <span key={index} className={styles.tag}>{industry}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integrations */}
                    {Array.isArray(metadata.facets.integrations) && metadata.facets.integrations.length > 0 && (
                      <div className={styles.metadataItem}>
                        <label>Integrations</label>
                        <div className={styles.tagList}>
                          {(metadata.facets.integrations as string[]).map((integration, index) => (
                            <span key={index} className={styles.tag}>{integration}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Source Repository */}
              {metadata.source_repository_url && (
                <div className={styles.metadataSection}>
                  <h4 className={styles.subsectionHeader}>Source Repository</h4>
                  <div className={styles.metadataItem}>
                    <a
                      href={metadata.source_repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.repoLink}
                    >
                      {metadata.source_repository_url}
                    </a>
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          ) : (
            <div className={styles.errorState}>
              <p>No metadata available</p>
              <p className={styles.errorDetails}>
                Agent may not be running or doesn't expose metadata
              </p>
            </div>
          )}
        </Card>

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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Setup Card - display from config metadata (not container) */}
        {metadata && (
          metadata?.model_dependencies ||
          metadata?.required_credentials ||
          metadata?.setup_instructions
        ) && (
          <Card>
            <h2>Setup Requirements</h2>

            {metadata.model_dependencies && metadata.model_dependencies.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Required Models
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {metadata.model_dependencies.map((model, index) => (
                    <code
                      key={index}
                      style={{
                        padding: '0.375rem 0.625rem',
                        backgroundColor: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {model}
                    </code>
                  ))}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Configure these models in Settings → Model Connections
                </p>
              </div>
            )}

            {metadata.required_credentials && metadata.required_credentials.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Required Credentials
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {metadata.required_credentials.map((cred, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--surface-2)',
                        borderRadius: 'var(--radius)',
                        borderLeft: '3px solid var(--info)'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                        {cred.name}
                      </div>
                      {cred.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {cred.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metadata.setup_instructions && (
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Setup Instructions
                </h3>
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                  }}
                >
                  {metadata.setup_instructions}
                </div>
              </div>
            )}
          </Card>
        )}

        <Card>
          <h2>Execute Agent</h2>
          <p className={styles.instructions}>
            {metadata?.input_schema && Object.keys(metadata.input_schema).length > 0
              ? 'Fill out the form below or edit the JSON directly. Both stay in sync.'
              : 'Enter a JSON payload to execute the agent.'}
          </p>
          <div className={styles.invokeForm}>
            {/* Smart Form - only show if input schema is available */}
            {metadata?.input_schema && Object.keys(metadata.input_schema).length > 0 && (
              <div className={styles.smartForm}>
                <h3 className={styles.smartFormTitle}>Input Parameters</h3>
                <div className={styles.formFields}>
                  {Object.entries(metadata.input_schema).map(([fieldName, fieldConfig]) => {
                    const config = fieldConfig as { required?: boolean; type?: string; label?: string; description?: string }
                    const fieldType = config.type?.toLowerCase() || 'string'
                    const rawValue = formValues[fieldName]
                    // Convert to string for input elements (they work with string values)
                    const stringValue = String(rawValue ?? '')

                    return (
                      <div key={fieldName} className={styles.formField}>
                        <label htmlFor={`field-${fieldName}`} className={styles.formLabel}>
                          <span className={styles.labelText}>
                            {config.label || fieldName}
                            {config.required && <span className={styles.requiredStar}>*</span>}
                          </span>
                          {config.description && (
                            <span className={styles.formFieldDescription}>{config.description}</span>
                          )}
                        </label>

                        {fieldType === 'boolean' ? (
                          <input
                            id={`field-${fieldName}`}
                            type="checkbox"
                            checked={!!rawValue}
                            onChange={(e) => handleFormFieldChange(fieldName, e.target.checked)}
                            className={styles.formCheckbox}
                          />
                        ) : fieldType === 'integer' || fieldType === 'number' ? (
                          <input
                            id={`field-${fieldName}`}
                            type="number"
                            value={stringValue}
                            onChange={(e) => {
                              const val = e.target.value
                              if (val === '') {
                                // Remove field from JSON when cleared
                                const newFormValues = { ...formValues }
                                delete newFormValues[fieldName]
                                setFormValues(newFormValues)
                                setInvokePayload(JSON.stringify(newFormValues, null, 2))
                              } else {
                                handleFormFieldChange(
                                  fieldName,
                                  fieldType === 'integer' ? parseInt(val) : parseFloat(val)
                                )
                              }
                            }}
                            className={styles.formInput}
                            step={fieldType === 'integer' ? '1' : 'any'}
                          />
                        ) : fieldType === 'date' ? (
                          <input
                            id={`field-${fieldName}`}
                            type="date"
                            value={stringValue}
                            onChange={(e) => handleFormFieldChange(fieldName, e.target.value)}
                            className={styles.formInput}
                          />
                        ) : (
                          <input
                            id={`field-${fieldName}`}
                            type="text"
                            value={stringValue}
                            onChange={(e) => handleFormFieldChange(fieldName, e.target.value)}
                            className={styles.formInput}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <label>
              {metadata?.input_schema && Object.keys(metadata.input_schema).length > 0
                ? 'JSON (Auto-generated from form above):'
                : 'Payload (JSON):'}
              <textarea
                className={styles.payloadInput}
                value={invokePayload}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={10}
                placeholder='{"message": "Hello, agent!"}'
              />
              {jsonParseError && (
                <span className={styles.jsonError}>Invalid JSON: {jsonParseError}</span>
              )}
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
              disabled={!isAuthenticated() || !requirementStatus.canExecute || invokeMutation.isPending || !!pollingStatus}
              title={
                !isAuthenticated()
                  ? 'Auth token required - configure in Configuration > Gateway Connection'
                  : !requirementStatus.canExecute
                  ? `Missing requirements: ${requirementStatus.missingRequirements.join('; ')}`
                  : undefined
              }
              data-tour="execute-agent-button"
            >
              <BoltIcon className={styles.executeIcon} />
              {!isAuthenticated() ? 'Auth Required' : invokeMutation.isPending ? 'Executing...' : pollingStatus ? 'Running...' : 'Execute'}
            </button>

            {!requirementStatus.canExecute && isAuthenticated() && (
              <div className={styles.authWarning}>
                <ExclamationTriangleIcon className={styles.warningIcon} />
                <div className={styles.warningContent}>
                  <p className={styles.warningTitle}>Requirements Not Met</p>
                  <p className={styles.warningMessage}>
                    {requirementStatus.missingRequirements.map((req, idx) => (
                      <span key={idx}>
                        {req}
                        {idx < requirementStatus.missingRequirements.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}

            {requirementStatus.canExecute && requirementStatus.warnings && requirementStatus.warnings.length > 0 && isAuthenticated() && (
              <div className={styles.authWarning}>
                <ExclamationTriangleIcon className={styles.warningIcon} />
                <div className={styles.warningContent}>
                  <p className={styles.warningTitle}>Requirements Unknown</p>
                  <p className={styles.warningMessage}>
                    {requirementStatus.warnings?.map((warning, idx) => (
                      <span key={idx}>
                        {warning}
                        {idx < (requirementStatus.warnings?.length ?? 0) - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}

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
                    <small>
                      Thread ID: {invocationResult.thread_id}
                      {' • '}
                      <a
                        href={`/executions?thread=${invocationResult.thread_id}`}
                        className={styles.executionLink}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(`/executions?thread=${invocationResult.thread_id}`)
                        }}
                      >
                        View Execution Details & Artifacts →
                      </a>
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
        </div>
      </div>

      {/* Developer Detail Modal */}
      {selectedDeveloper && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDeveloper(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.developerHeaderInfo}>
                {selectedDeveloper.avatar_url ? (
                  <img
                    src={selectedDeveloper.avatar_url}
                    alt={selectedDeveloper.name}
                    className={styles.developerAvatar}
                  />
                ) : (
                  <div className={styles.developerAvatarPlaceholder}>
                    {selectedDeveloper.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2>{selectedDeveloper.name}</h2>
                  <p className={styles.modalDeveloper}>
                    Developer Profile
                  </p>
                </div>
              </div>
              <button className={styles.closeButton} onClick={() => setSelectedDeveloper(null)}>×</button>
            </div>

            <div className={styles.modalBody}>
              {isDeveloperLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <p>Loading developer info...</p>
                </div>
              ) : (
                <>
                  {/* Developer Name (Always show) */}
                  <div className={styles.modalSpecs}>
                    <div className={styles.specGroup}>
                      <h4><UserIcon />Developer</h4>
                      <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
                        {selectedDeveloper.name}
                      </p>
                      {selectedDeveloper.agent_count > 0 && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {selectedDeveloper.agent_count} published {selectedDeveloper.agent_count === 1 ? 'agent' : 'agents'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  {(selectedDeveloper.tagline || selectedDeveloper.bio || selectedDeveloper.developer_type || selectedDeveloper.company || selectedDeveloper.location || selectedDeveloper.years_experience) && (
                    <div className={styles.modalSpecs}>
                      <div className={styles.specGroup}>
                        <h4><UserIcon />About</h4>
                        <ul>
                          {selectedDeveloper.tagline && (
                            <li>
                              <strong><ChatBubbleLeftRightIcon />Tagline</strong>
                              <span>{selectedDeveloper.tagline}</span>
                            </li>
                          )}
                          {selectedDeveloper.bio && (
                            <li>
                              <strong><IdentificationIcon />Bio</strong>
                              <span>{selectedDeveloper.bio}</span>
                            </li>
                          )}
                          {selectedDeveloper.developer_type && (
                            <li>
                              <strong><BriefcaseIcon />Type</strong>
                              <span>{selectedDeveloper.developer_type}</span>
                            </li>
                          )}
                          {selectedDeveloper.company && (
                            <li>
                              <strong><BuildingOfficeIcon />Company</strong>
                              <span>{selectedDeveloper.company}</span>
                            </li>
                          )}
                          {selectedDeveloper.location && (
                            <li>
                              <strong><MapPinIcon />Location</strong>
                              <span>{selectedDeveloper.location}</span>
                            </li>
                          )}
                          {selectedDeveloper.years_experience && (
                            <li>
                              <strong><CalendarIcon />Experience</strong>
                              <span>{selectedDeveloper.years_experience} years</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Contact & Links Section */}
                  {(selectedDeveloper.website || selectedDeveloper.support_email || selectedDeveloper.documentation_url) && (
                    <div className={styles.modalSpecs}>
                      <div className={styles.specGroup}>
                        <h4><GlobeAltIcon />Contact & Links</h4>
                        <ul>
                          {selectedDeveloper.website && (
                            <li>
                              <strong><GlobeAltIcon />Website</strong>
                              <a href={selectedDeveloper.website} target="_blank" rel="noopener noreferrer">
                                {selectedDeveloper.website}
                              </a>
                            </li>
                          )}
                          {selectedDeveloper.support_email && (
                            <li>
                              <strong><EnvelopeIcon />Support</strong>
                              <a href={`mailto:${selectedDeveloper.support_email}`}>{selectedDeveloper.support_email}</a>
                            </li>
                          )}
                          {selectedDeveloper.documentation_url && (
                            <li>
                              <strong><BookOpenIcon />Documentation</strong>
                              <a href={selectedDeveloper.documentation_url} target="_blank" rel="noopener noreferrer">
                                {selectedDeveloper.documentation_url}
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Social Section */}
                  {(selectedDeveloper.github_username || selectedDeveloper.twitter_handle || selectedDeveloper.linkedin_url || selectedDeveloper.discord_username) && (
                    <div className={styles.modalSpecs}>
                      <div className={styles.specGroup}>
                        <h4><UserGroupIcon />Social</h4>
                        <ul>
                          {selectedDeveloper.github_username && (
                            <li>
                              <strong><LinkIcon />GitHub</strong>
                              <a href={`https://github.com/${selectedDeveloper.github_username}`} target="_blank" rel="noopener noreferrer">
                                @{selectedDeveloper.github_username}
                              </a>
                            </li>
                          )}
                          {selectedDeveloper.twitter_handle && (
                            <li>
                              <strong><LinkIcon />Twitter</strong>
                              <a href={`https://twitter.com/${selectedDeveloper.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                                @{selectedDeveloper.twitter_handle}
                              </a>
                            </li>
                          )}
                          {selectedDeveloper.linkedin_url && (
                            <li>
                              <strong><LinkIcon />LinkedIn</strong>
                              <a href={selectedDeveloper.linkedin_url} target="_blank" rel="noopener noreferrer">
                                View Profile
                              </a>
                            </li>
                          )}
                          {selectedDeveloper.discord_username && (
                            <li>
                              <strong><LinkIcon />Discord</strong>
                              <span>{selectedDeveloper.discord_username}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Professional Section */}
                  {(selectedDeveloper.expertise || selectedDeveloper.featured_work || selectedDeveloper.open_to_collaboration || selectedDeveloper.sponsor_url) && (
                    <div className={styles.modalSpecs}>
                      <div className={styles.specGroup}>
                        <h4><LightBulbIcon />Professional</h4>
                        {selectedDeveloper.expertise && selectedDeveloper.expertise.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                              <LightBulbIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                              Expertise
                            </strong>
                            <div className={styles.expertiseBadges}>
                              {selectedDeveloper.expertise.map((skill, index) => (
                                <span key={index} className={styles.expertiseBadge}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedDeveloper.featured_work && selectedDeveloper.featured_work.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                              <FolderIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                              Featured Work
                            </strong>
                            <ul className={styles.nestedList}>
                              {selectedDeveloper.featured_work.map((work, index) => (
                                <li key={index}>
                                  <a href={work} target="_blank" rel="noopener noreferrer">
                                    {work}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedDeveloper.open_to_collaboration === true && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <span className={styles.collaborationBadge}>
                              <HandRaisedIcon style={{ width: '1rem', height: '1rem' }} />
                              Open to Collaboration
                            </span>
                          </div>
                        )}
                        {selectedDeveloper.sponsor_url && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                              <HeartIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                              Sponsor
                            </strong>
                            <a href={selectedDeveloper.sponsor_url} target="_blank" rel="noopener noreferrer">
                              {selectedDeveloper.sponsor_url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Developer's Agents */}
                  <div className={styles.modalSpecs}>
                    <div className={styles.specGroup}>
                      <h4>
                        <GlobeAltIcon />
                        Published Agents {!isLoadingAgents && `(${developerAgents.length})`}
                      </h4>
                      {isLoadingAgents ? (
                        <div className={styles.loading}>
                          <div className={styles.spinner} />
                          <p>Loading agents...</p>
                        </div>
                      ) : developerAgents.length === 0 ? (
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          No agents found for this developer in the connected index.
                        </p>
                      ) : (
                        <div className={styles.developerAgentsList}>
                          {developerAgents.slice(0, 10).map(agent => (
                            <div
                              key={agent.id}
                              className={styles.developerAgentItem}
                            >
                              <div>
                                <div className={styles.developerAgentName}>{agent.name}</div>
                                <div className={styles.developerAgentDescription}>
                                  {agent.description || 'No description'}
                                </div>
                              </div>
                              {agent._index_name && (
                                <span className={styles.indexBadge}>
                                  <GlobeAltIcon className={styles.indexIcon} />
                                  {agent._index_name}
                                </span>
                              )}
                            </div>
                          ))}
                          {developerAgents.length > 10 && (
                            <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                              Showing 10 of {developerAgents.length} agents
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className="btn btn-lg btn-ghost" onClick={() => setSelectedDeveloper(null)}>
                Close
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