import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import { useAuthStore } from '@stores/authStore'
import { sanitizeJsonString, rateLimiter } from '@utils/security'
import type { InvocationResult } from '../types/api'
import styles from './AgentDetail.module.css'

export default function AgentDetail() {
  const { agentName } = useParams<{ agentName: string }>()
  const { playClickSound } = useAudio()
  const { gatewayUrl } = useAuthStore()
  const [invokePayload, setInvokePayload] = useState('{\n  "message": "Hello, agent!",\n  "task": "process this request"\n}')
  const [invocationResult, setInvocationResult] = useState<InvocationResult | null>(null)
  const [pollingStatus, setPollingStatus] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [syncMode, setSyncMode] = useState(false)

  const { data: metadata, isLoading: metadataLoading, error: metadataError } = useQuery({
    queryKey: ['agent-metadata', agentName],
    queryFn: () => agentsApi.getMetadata(agentName!),
    enabled: !!agentName,
    retry: 3,
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
    onSuccess: async (response) => {
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

  const handleInvoke = () => {
    playClickSound()
    
    // Clear previous results and status
    setInvocationResult(null)
    setPollingStatus('')
    
    // Rate limiting to prevent spam
    if (!rateLimiter.isAllowed('agent-invoke', 10, 60000)) {
      alert('Too many invocation attempts. Please wait a moment before trying again.')
      return
    }
    
    try {
      // Sanitize JSON input before parsing
      const sanitizedPayload = sanitizeJsonString(invokePayload)
      const payload = JSON.parse(sanitizedPayload)
      
      // Add sync flag if enabled
      if (syncMode) {
        payload.sync = true
      }
      
      // Update UI with sanitized payload if it was changed
      if (sanitizedPayload !== invokePayload) {
        setInvokePayload(sanitizedPayload)
      }
      
      invokeMutation.mutate({ payload, files: selectedFiles })
    } catch (error) {
      console.error('Invalid JSON payload:', error)
      alert('Invalid JSON format. Please check your payload.')
    }
  }

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <h1>{agentName}</h1>
        <p className={styles.subtitle}>Agent details and invocation</p>
      </div>

      <div className={styles.grid}>
        <Card>
          <h2>Agent Information</h2>
          {metadataLoading ? (
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
          ) : (
            <div className={styles.errorState}>
              <p>No metadata available</p>
              <p className={styles.errorDetails}>
                Agent may not be running or doesn't expose metadata
              </p>
            </div>
          )}
          
          <div className={styles.documentationLinks}>
            <a 
              href={`${gatewayUrl}/${agentName}/docs`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.docLink}
            >
              📖 View API Documentation
            </a>
            
            <div className={styles.rawMetadata}>
              <h4>Raw Metadata (JSON)</h4>
              <pre className={styles.metadata}>
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Invoke Agent</h2>
          <p className={styles.instructions}>
            Enter a JSON payload to send to the agent. Make sure you have configured your auth token in{' '}
            <a href="/settings" className={styles.settingsLink}>Settings</a> first.
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

            <div className={styles.options}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={syncMode}
                  onChange={(e) => setSyncMode(e.target.checked)}
                  className={styles.checkbox}
                />
                Synchronous mode (wait for completion)
              </label>
            </div>
            
            <button
              className={styles.invokeButton}
              onClick={handleInvoke}
              disabled={invokeMutation.isPending || !!pollingStatus}
            >
              {invokeMutation.isPending ? 'Invoking...' : pollingStatus ? 'Processing...' : 'Invoke'}
            </button>

            {pollingStatus && (
              <div className={styles.statusIndicator}>
                <div className={styles.spinner}></div>
                <span>{pollingStatus}</span>
              </div>
            )}

            {invocationResult && (
              <div className={styles.result}>
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
                    <pre>{JSON.stringify(invocationResult.result, null, 2)}</pre>
                  </div>
                )}
                <div className={styles.threadInfo}>
                  <small>Thread ID: {invocationResult.thread_id}</small>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}