import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { 
  FolderIcon, 
  DocumentIcon, 
  ArrowDownTrayIcon, 
  EyeIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { agentsApi } from '@api/agents'
import { apiClient } from '@api/client'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import { useAuthStore } from '@stores/authStore'
import ErrorMessage from '@components/ErrorMessage'
import styles from './Artifacts.module.css'

interface ArtifactFile {
  name: string
  path: string
  size: number
  modified: string
  type: 'in' | 'out'
}

interface ExecutionArtifacts {
  thread_id: string
  agent: string
  created_at: string
  state: string
  input_files: ArtifactFile[]
  output_files: ArtifactFile[]
}

export default function Artifacts() {
  const { playClickSound } = useAudio()
  const { isAuthenticated } = useAuthStore()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
  const [previewFile, setPreviewFile] = useState<ArtifactFile | null>(null)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  // Get filter from URL params
  useEffect(() => {
    const thread = searchParams.get('thread')
    const agent = searchParams.get('agent')
    if (thread) setSearchQuery(thread)
    if (agent) setAgentFilter(agent)
  }, [searchParams])

  // Fetch executions to get artifact information
  const { data: executionsData, isLoading, error } = useQuery({
    queryKey: ['executions', 'artifacts'],
    queryFn: () => agentsApi.listExecutions({ limit: 100 }),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  })

  // Fetch agents for filter dropdown
  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.list,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  })

  // Fetch artifacts for each execution
  const { data: artifactsData } = useQuery({
    queryKey: ['artifacts', executionsData?.executions?.map(e => e.thread_id)],
    queryFn: async () => {
      if (!executionsData?.executions) return []
      
      const artifactsPromises = executionsData.executions.map(async (execution) => {
        try {
          const artifactData = await agentsApi.getArtifacts(execution.thread_id)
          
          return {
            thread_id: execution.thread_id,
            agent: execution.agent,
            created_at: execution.created_at,
            state: execution.state,
            input_files: artifactData.input_files || [],
            output_files: artifactData.output_files || []
          }
        } catch (error) {
          console.error(`Failed to fetch artifacts for ${execution.thread_id}:`, error)
          return {
            thread_id: execution.thread_id,
            agent: execution.agent,
            created_at: execution.created_at,
            state: execution.state,
            input_files: [],
            output_files: []
          }
        }
      })
      
      return Promise.all(artifactsPromises)
    },
    enabled: isAuthenticated && (executionsData?.executions?.length ?? 0) > 0,
    staleTime: 30000, // Cache for 30 seconds
  })

  // Use real artifacts data
  const executionsWithArtifacts: ExecutionArtifacts[] = artifactsData || []

  // Filter executions based on search and filters
  const filteredExecutions = executionsWithArtifacts.filter(execution => {
    const matchesSearch = searchQuery === '' || 
      execution.thread_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.input_files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      execution.output_files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAgent = agentFilter === 'all' || execution.agent === agentFilter

    const hasFiles = execution.input_files.length > 0 || execution.output_files.length > 0
    const matchesFileType = fileTypeFilter === 'all' || 
      (fileTypeFilter === 'with-files' && hasFiles) ||
      (fileTypeFilter === 'input-only' && execution.input_files.length > 0) ||
      (fileTypeFilter === 'output-only' && execution.output_files.length > 0)

    // Always require files to be present (hide executions with no artifacts)
    const hasAnyFiles = execution.input_files.length > 0 || execution.output_files.length > 0

    return matchesSearch && matchesAgent && matchesFileType && hasAnyFiles
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <DocumentIcon className={styles.fileIcon} />
      case 'csv':
      case 'json':
      case 'xml':
        return <DocumentIcon className={styles.fileIcon} />
      default:
        return <DocumentIcon className={styles.fileIcon} />
    }
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
      setPreviewContent(`Failed to load preview: ${(error as any)?.response?.status || 'Network error'}`)
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
      alert(`Download failed: ${(error as any)?.response?.status || 'Network error'}`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <ErrorMessage message="Please configure your gateway connection in Settings first" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Card>
          <div className={styles.loadingState}>
            Loading artifacts...
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage message="Failed to load executions for artifact browsing" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Artifacts</h1>
        <p className={styles.subtitle}>Browse and download execution files</p>
      </div>

      {/* Filters and Search */}
      <div className={styles.controlsContainer}>
        <div className={styles.primaryControls}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Search by execution, agent, or filename..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  playClickSound()
                }}
                className={styles.clearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <select
            className={styles.filterSelect}
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="all">All Agents ({filteredExecutions.length})</option>
            {agentsData?.agents.map(agent => (
              <option key={agent.name} value={agent.name}>
                {agent.name} ({executionsWithArtifacts.filter(e => e.agent === agent.name).length})
              </option>
            ))}
          </select>
          
          <select
            className={styles.filterSelect}
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="with-files">With Files</option>
            <option value="input-only">Input Files Only</option>
            <option value="output-only">Output Files Only</option>
          </select>

          <span className={styles.resultCount}>
            {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Artifacts List */}
      <div className={styles.artifactsList}>
        {filteredExecutions.length === 0 ? (
          <Card>
            <div className={styles.emptyState}>
              <FolderIcon className={styles.emptyIcon} />
              <h3>No artifacts found</h3>
              <p>No executions match your current search and filter criteria.</p>
            </div>
          </Card>
        ) : (
          filteredExecutions.map(execution => (
            <Card key={execution.thread_id} className={styles.executionCard}>
              <div className={styles.executionHeader}>
                <div className={styles.executionInfo}>
                  <h3 className={styles.executionTitle}>
                    {execution.agent}
                  </h3>
                  <div className={styles.executionMeta}>
                    <span className={styles.threadId}>
                      {execution.thread_id}
                    </span>
                    <span className={`${styles.state} ${styles[execution.state]}`}>
                      {execution.state}
                    </span>
                    <span className={styles.timestamp}>
                      <ClockIcon className={styles.timestampIcon} />
                      {format(new Date(execution.created_at), 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.filesGrid}>
                {execution.input_files.length > 0 && (
                  <div className={styles.fileSection}>
                    <h4 className={styles.sectionTitle}>
                      Input Files ({execution.input_files.length})
                    </h4>
                    <div className={styles.filesList}>
                      {execution.input_files.map(file => (
                        <div key={file.path} className={styles.fileItem}>
                          {getFileIcon(file.name)}
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
                  </div>
                )}

                {execution.output_files.length > 0 && (
                  <div className={styles.fileSection}>
                    <h4 className={styles.sectionTitle}>
                      Output Files ({execution.output_files.length})
                    </h4>
                    <div className={styles.filesList}>
                      {execution.output_files.map(file => (
                        <div key={file.path} className={styles.fileItem}>
                          {getFileIcon(file.name)}
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
                  </div>
                )}

              </div>
            </Card>
          ))
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
    </div>
  )
}