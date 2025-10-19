import { useState, useEffect } from 'react'
import { useConfigStore } from '@stores/configStore'
import { useToast } from '@hooks/useToast'
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  UserIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  EnvelopeIcon,
  BookOpenIcon,
  LightBulbIcon,
  FolderIcon,
  HandRaisedIcon,
  HeartIcon,
  CpuChipIcon,
  LinkIcon,
  UserGroupIcon,
  CodeBracketIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import styles from './Discover.module.css'

interface FieldConfig {
  required?: boolean
  label?: string
  description?: string
  type?: string
  [key: string]: unknown
}

interface IndexAgent {
  id?: string // Legacy field
  _id: string // New ID format: "developer/agent"
  name: string
  version: string
  description: string
  image_repository_url: string | null
  source_repository_url: string | null
  listing_status: string
  image_repository_access: string
  source_repository_access: string
  created_at: string
  // Developer info - now flat structure from GitHub Pages API
  developer: string // GitHub username
  developer_id: string
  developer_name: string // Full name for display
  developer_avatar_url: string | null
  // Discovery & Classification
  context?: string | null
  primary_function?: string | null
  readiness_level?: string | null
  // Compatibility Requirements
  model_requirements?: string[] | null
  required_integrations?: Record<string, unknown>[] | null
  required_egress?: string[] | null
  input_types?: Array<{ type: string; mime_types?: string[] }> | null
  output_types?: Array<{ type: string; mime_types?: string[] }> | null
  input_schema?: Record<string, FieldConfig> | null
  // Flexible metadata
  facets?: Record<string, unknown> | null
  _index_name?: string // Track which index this came from
  _index_url?: string // Track the index URL for API calls
}

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

type SortOption = 'newest' | 'oldest' | 'alphabetical'

export default function Discover() {
  const { getIndexConnections, getAgents, isLoading: isConfigLoading } = useConfigStore()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [agents, setAgents] = useState<IndexAgent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<string | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedAgent, setSelectedAgent] = useState<IndexAgent | null>(null)
  const [selectedDeveloper, setSelectedDeveloper] = useState<{ info: DeveloperInfo; indexUrl: string } | null>(null)
  const [isDeveloperLoading, setIsDeveloperLoading] = useState(false)
  const [previousDeveloper, setPreviousDeveloper] = useState<{ info: DeveloperInfo; indexUrl: string } | null>(null)
  const [developerFilter, setDeveloperFilter] = useState<string | null>(null)
  const [agentToAdd, setAgentToAdd] = useState<IndexAgent | null>(null)
  const [customAgentName, setCustomAgentName] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [hasAcknowledged, setHasAcknowledged] = useState(false)
  const [hasApprovedEgress, setHasApprovedEgress] = useState(false)
  const [agentToRemove, setAgentToRemove] = useState<IndexAgent | null>(null)
  const [displayCount, setDisplayCount] = useState(12)
  const LOAD_MORE_INCREMENT = 12

  // Wait for config to load before reading indexes
  const indexes = isConfigLoading ? [] : getIndexConnections()
  const enabledIndexes = indexes.filter(idx => idx.enabled)

  // Note: Agent add status is checked dynamically via isAgentAdded()

  const isAgentAdded = (agent: IndexAgent) => {
    // Check if this agent is added by matching the source agent ID AND index URL in labels
    // This ensures uniqueness across multiple indexes that might have the same developer/agent combo
    const configAgents = getAgents()

    // Match by index URL + agent ID (most accurate - handles same developer/agent across different indexes)
    if (agent._index_url) {
      const matchByIndexAndId = configAgents.some(configAgent =>
        configAgent.labels?.['index.source.index.url'] === agent._index_url &&
        (configAgent.labels?.['index.source.agent.id'] === agent._id ||
         configAgent.labels?.['index.source.agent.id'] === agent.id)  // Legacy support
      )
      if (matchByIndexAndId) return true
    }

    // Fallback: match by agent ID only (for agents added before index URL tracking)
    const matchById = configAgents.some(configAgent =>
      configAgent.labels?.['index.source.agent.id'] === agent._id ||
      configAgent.labels?.['index.source.agent.id'] === agent.id  // Legacy support
    )
    if (matchById) return true

    // Fallback: match by name only for agents added before ID tracking was implemented
    // This only works if there's no ambiguity (no other agents with tracking labels using this name)
    const hasAnyTrackedAgent = configAgents.some(configAgent =>
      configAgent.labels?.['index.source.agent.id'] && configAgent.name === agent.name
    )
    if (hasAnyTrackedAgent) {
      // If there's already a tracked agent with this name, don't match by name alone
      return false
    }

    // Only match by name if no tracked agents use this name
    return configAgents.some(configAgent => configAgent.name === agent.name)
  }

  // Fetch agents when config loads or when selected index changes
  useEffect(() => {
    if (!isConfigLoading) {
      fetchAgents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, isConfigLoading])

  const fetchAgents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (enabledIndexes.length === 0) {
        setAgents([])
        setIsLoading(false)
        return
      }

      // Fetch agents from selected index or all enabled indexes
      const indexesToFetch = selectedIndex === 'all'
        ? enabledIndexes
        : enabledIndexes.filter(idx => idx.id === selectedIndex)

      const fetchPromises = indexesToFetch.map(async (index) => {
        try {
          const response = await fetch(`${index.url}/index.json`)
          if (!response.ok) {
            throw new Error(`Failed to fetch from ${index.name}`)
          }
          const data = await response.json()
          // Tag each agent with the index it came from
          const agents = (data.agents || []).map((agent: IndexAgent) => ({
            ...agent,
            _index_name: index.name,
            _index_url: index.url
          }))
          return agents
        } catch (err) {
          console.error(`Error fetching from ${index.name}:`, err)
          return []
        }
      })

      const results = await Promise.all(fetchPromises)
      const allAgents = results.flat()
      setAgents(allAgents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort agents
  const filteredAgents = agents
    .filter(agent => {
      // Developer filter
      if (developerFilter && agent.developer !== developerFilter) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          agent.name?.toLowerCase().includes(query) ||
          agent.description?.toLowerCase().includes(query) ||
          agent.developer?.toLowerCase().includes(query) ||
          agent.developer_name?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12)
  }, [searchQuery, selectedIndex, sortBy, developerFilter])

  // Paginate filtered agents
  const displayedAgents = filteredAgents.slice(0, displayCount)
  const hasMore = displayCount < filteredAgents.length

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_INCREMENT)
  }

  const fetchDeveloperInfo = async (developerName: string, indexUrl: string) => {
    // Show modal immediately with placeholder data
    const developerAgents = agents.filter(a => a.developer === developerName)
    const placeholderInfo: DeveloperInfo = {
      id: developerAgents[0]?.developer_id || developerName,
      name: developerAgents[0]?.developer_name || developerName,
      avatar_url: developerAgents[0]?.developer_avatar_url || null,
      agent_count: developerAgents.length
    }

    setSelectedDeveloper({ info: placeholderInfo, indexUrl })
    setIsDeveloperLoading(true)

    try {
      const response = await fetch(`${indexUrl}/@${developerName}/profile.json`)
      if (!response.ok) {
        throw new Error('Failed to fetch developer info')
      }
      const data = await response.json()

      // Map GitHub Pages API structure to UI structure
      const developerInfo: DeveloperInfo = {
        id: data._id || data.developer || developerName,
        name: data.name || developerName,
        avatar_url: data.avatar_url || null,
        agent_count: data._agent_count || developerAgents.length,
        bio: data.bio,
        tagline: data.tagline,
        developer_type: data.type,
        company: data.company,
        location: data.location,
        years_experience: data.years_experience,
        website: data.website,
        support_email: data.support_email,
        documentation_url: data.documentation_url,
        github_username: data.github_username,
        twitter_handle: data.twitter_handle,
        linkedin_url: data.linkedin_url,
        discord_username: data.discord_username,
        expertise: data.expertise,
        featured_work: data.featured_work,
        open_to_collaboration: data.open_to_collaboration,
        sponsor_url: data.sponsor_url,
      }

      setSelectedDeveloper({ info: developerInfo, indexUrl })
    } catch (err) {
      console.error('Error fetching developer:', err)
      // Keep the placeholder data we already set
    } finally {
      setIsDeveloperLoading(false)
    }
  }

  const handleAddAgent = (agent: IndexAgent) => {
    if (!agent.image_repository_url) {
      showError(`Cannot add ${agent.name}: No image repository URL available. This agent has a private image repository.`)
      return
    }

    // Show add modal with name input
    setAgentToAdd(agent)
    setCustomAgentName(agent.name)
    setNameError(null)
    setHasAcknowledged(false)
    setHasApprovedEgress(false)
  }

  const confirmAddAgent = async () => {
    if (!agentToAdd) return

    // Check name
    const existingAgents = getAgents()
    if (existingAgents.some(a => a.name === customAgentName)) {
      setNameError(`Agent name "${customAgentName}" already exists.`)
      return
    }

    if (!customAgentName.trim()) {
      setNameError('Agent name cannot be empty.')
      return
    }

    try {
      // Parse image repository URL (e.g., "docker.io/username/repo:tag")
      const parseImageUrl = (url: string) => {
        // Remove protocol if present
        const cleanUrl = url.replace(/^https?:\/\//, '')

        // Split into registry and path
        const parts = cleanUrl.split('/')
        let registryUrl: string
        let repoPath: string
        let tag = 'latest'

        // Check if first part looks like a registry domain (contains . or :)
        if (parts[0].includes('.') || parts[0].includes(':')) {
          registryUrl = parts[0]
          repoPath = parts.slice(1).join('/')
        } else {
          // Default to docker.io for simple image names
          registryUrl = 'docker.io'
          repoPath = cleanUrl
        }

        // Extract tag if present
        if (repoPath.includes(':')) {
          const [path, imageTag] = repoPath.split(':')
          repoPath = path
          tag = imageTag
        }

        return { registryUrl, repoPath, tag }
      }

      // At this point, image_repository_url is guaranteed to be non-null due to the check at line 288
      const { registryUrl, repoPath, tag } = parseImageUrl(agentToAdd.image_repository_url!)

      // Determine registry connection ID and name
      const registryIdMap: Record<string, string> = {
        'docker.io': 'dockerhub_public',
        'ghcr.io': 'github_registry',
        'gcr.io': 'google_registry'
      }

      const registryId = registryIdMap[registryUrl] || registryUrl.replace(/[^a-z0-9]/g, '_')
      const registryName = registryUrl === 'docker.io' ? 'Docker Hub (Public)' :
                           registryUrl === 'ghcr.io' ? 'GitHub Container Registry' :
                           registryUrl === 'gcr.io' ? 'Google Container Registry' :
                           registryUrl

      // Get config store methods
      const { getRegistryConnections, addRegistryConnection, addAgent, saveConfig } = useConfigStore.getState()

      // Check if registry connection already exists
      const existingRegistries = getRegistryConnections()
      const registryExists = existingRegistries.some(r => r.id === registryId)

      // Add registry connection if it doesn't exist
      if (!registryExists) {
        addRegistryConnection({
          name: registryName,
          url: registryUrl,
          enabled: true,
          authMethod: 'none'
        })
      }

      // Add agent with custom name and metadata to track source
      addAgent({
        name: customAgentName,
        repo: repoPath,
        tag: tag,
        registry_connection: registryId,
        egressAllowlist: (agentToAdd.required_egress || []).join(', '),
        labels: {
          'agent.port': '8000',
          'index.source.agent.id': agentToAdd._id,
          'index.source.agent.name': agentToAdd.name,
          'index.source.index.url': agentToAdd._index_url || ''
        },
        envVariables: {},
        exposePorts: '8000'
      })

      // Auto-save config to disk
      await saveConfig()

      // Close modal
      setAgentToAdd(null)
      setCustomAgentName('')
      setNameError(null)
      setHasAcknowledged(false)
      setHasApprovedEgress(false)

      showSuccess(`Successfully added ${customAgentName}! Restart AgentSystems to pull the image and start the agent.`)
    } catch (error) {
      console.error('Error adding agent:', error)
      setNameError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleRemoveAgent = (agent: IndexAgent) => {
    // Show remove modal
    setAgentToRemove(agent)
  }

  const confirmRemoveAgent = async () => {
    if (!agentToRemove) return

    try {
      // Get config store methods
      const { deleteAgent, saveConfig, getAgents } = useConfigStore.getState()

      // Find the added agent by matching the source index URL + agent ID in labels
      // This ensures we remove the correct agent when the same developer/agent exists in multiple indexes
      const configAgents = getAgents()

      // First try to match by index URL + agent ID (most accurate)
      let addedAgent = configAgents.find(configAgent =>
        agentToRemove._index_url &&
        configAgent.labels?.['index.source.index.url'] === agentToRemove._index_url &&
        (configAgent.labels?.['index.source.agent.id'] === agentToRemove._id ||
         configAgent.labels?.['index.source.agent.id'] === agentToRemove.id)  // Legacy support
      )

      // Fallback: match by agent ID only (for agents added before index URL tracking)
      if (!addedAgent) {
        addedAgent = configAgents.find(configAgent =>
          configAgent.labels?.['index.source.agent.id'] === agentToRemove._id ||
          configAgent.labels?.['index.source.agent.id'] === agentToRemove.id  // Legacy support
        )
      }

      if (!addedAgent) {
        throw new Error('Agent not found in configuration')
      }

      // Delete agent using its actual configured name
      deleteAgent(addedAgent.name)

      // Auto-save config to disk
      await saveConfig()

      // Close modal
      setAgentToRemove(null)

      showSuccess(`Successfully removed ${addedAgent.name}! Restart AgentSystems to stop the agent.`)
    } catch (error) {
      console.error('Error removing agent:', error)
      showError(`Failed to remove ${agentToRemove.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setAgentToRemove(null)
    }
  }

  // Show loading state while config is loading
  if (isConfigLoading) {
    return (
      <div className={styles.discover}>
        <div className={styles.header}>
          <div>
            <h1>Discover Agents</h1>
            <p className={styles.subtitle}>
              Browse and add community agents from connected indexes
            </p>
          </div>
        </div>

        <Card>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading configuration...</p>
          </div>
        </Card>
      </div>
    )
  }

  // Show empty state if no enabled indexes after config loads
  if (enabledIndexes.length === 0) {
    return (
      <div className={styles.discover}>
        <div className={styles.header}>
          <div>
            <h1>Discover Agents</h1>
            <p className={styles.subtitle}>
              Browse and add community agents from connected indexes
            </p>
          </div>
        </div>

        <Card className={styles.emptyStateCard}>
          <div className={styles.emptyState}>
            <GlobeAltIcon className={styles.emptyIcon} />
            <h3>No Index Connections Enabled</h3>
            <p>Enable at least one index connection to discover community agents.</p>
            <a href="/configuration/index-connections" className="btn btn-lg btn-bright">
              Configure Index Connections
            </a>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.discover}>
      <div className={styles.header}>
        <div>
          {developerFilter ? (
            <>
              <div className={styles.backLink} onClick={() => setDeveloperFilter(null)}>
                <ArrowLeftIcon className={styles.backIcon} />
                Back to All Agents
              </div>
              <h1>{developerFilter}</h1>
              <p className={styles.subtitle}>
                Showing {displayedAgents.length} of {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'} by this developer
              </p>
            </>
          ) : (
            <>
              <h1>Discover Agents</h1>
              <p className={styles.subtitle}>
                Browse and add community agents from {enabledIndexes.length} connected {enabledIndexes.length === 1 ? 'index' : 'indexes'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search agents by name, description, or developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Index:</label>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Indexes</option>
              {enabledIndexes.map(index => (
                <option key={index.id} value={index.id}>
                  {index.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={styles.select}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results */}
      {isLoading ? (
        <Card>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading agents...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className={styles.errorCard}>
          <div className={styles.error}>
            <ExclamationTriangleIcon />
            <div>
              <h3>Error Loading Agents</h3>
              <p>{error}</p>
            </div>
          </div>
        </Card>
      ) : filteredAgents.length === 0 ? (
        <Card>
          <div className={styles.noResults}>
            <p>No agents found{searchQuery ? ' matching your search' : ''}.</p>
            {searchQuery && <p>Try a different search term.</p>}
          </div>
        </Card>
      ) : (
        <>
          <section className={styles.section}>
            <h2>
              {searchQuery ? `Search Results (${filteredAgents.length})` : `All Agents (${filteredAgents.length})`}
            </h2>

            <div className={styles.agentGrid}>
              {displayedAgents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => setSelectedAgent(agent)}
                  onDeveloperClick={(devName, indexUrl) => fetchDeveloperInfo(devName, indexUrl)}
                  onAdd={() => handleAddAgent(agent)}
                  onRemove={() => handleRemoveAgent(agent)}
                  isAdded={isAgentAdded(agent)}
                />
              ))}
            </div>
          </section>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={handleLoadMore}
                className="btn btn-lg btn-subtle"
              >
                Load More ({filteredAgents.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => {
            setSelectedAgent(null)
            setPreviousDeveloper(null)
          }}
          onBack={previousDeveloper ? () => {
            setSelectedDeveloper(previousDeveloper)
            setSelectedAgent(null)
            setPreviousDeveloper(null)
          } : undefined}
          onDeveloperClick={(devName, indexUrl) => {
            fetchDeveloperInfo(devName, indexUrl)
            setSelectedAgent(null)
            setPreviousDeveloper(null)
          }}
          onAdd={() => handleAddAgent(selectedAgent)}
          onRemove={() => handleRemoveAgent(selectedAgent)}
          isAdded={isAgentAdded(selectedAgent)}
        />
      )}

      {/* Developer Detail Modal */}
      {selectedDeveloper && (
        <DeveloperModal
          developer={selectedDeveloper.info}
          agents={agents.filter(a => a.developer === selectedDeveloper.info.id)}
          onClose={() => {
            setSelectedDeveloper(null)
            setPreviousDeveloper(null)
          }}
          onAgentClick={(agent) => {
            setPreviousDeveloper(selectedDeveloper)
            setSelectedAgent(agent)
            setSelectedDeveloper(null)
          }}
          onViewAll={() => {
            setDeveloperFilter(selectedDeveloper.info.id)
            setSelectedDeveloper(null)
            setPreviousDeveloper(null)
          }}
          isLoading={isDeveloperLoading}
        />
      )}

      {/* Add Agent Name Modal */}
      {agentToAdd && (
        <div className={styles.modalOverlay} onClick={() => {
          setAgentToAdd(null)
          setCustomAgentName('')
          setNameError(null)
          setHasAcknowledged(false)
          setHasApprovedEgress(false)
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Add Agent</h2>
                <p className={styles.modalDeveloper}>
                  {agentToAdd.name} by @{agentToAdd.developer}
                </p>
              </div>
              <button className={styles.closeButton} onClick={() => {
                setAgentToAdd(null)
                setCustomAgentName('')
                setNameError(null)
                setHasAcknowledged(false)
                setHasApprovedEgress(false)
              }}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalDescription}>
                <p>Choose a unique name for this agent. The name will be used as the Docker container name.</p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Agent Name
                </label>
                <input
                  type="text"
                  value={customAgentName}
                  onChange={(e) => {
                    setCustomAgentName(e.target.value)
                    setNameError(null)
                  }}
                  className={styles.searchInput}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: nameError ? '1px solid var(--error)' : '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                  placeholder="Enter agent name"
                  autoFocus
                />

                {nameError && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--error-bg, rgba(239, 68, 68, 0.1))',
                    border: '1px solid var(--error)',
                    borderRadius: '0.375rem',
                    color: 'var(--error)',
                    fontSize: '0.875rem'
                  }}>
                    <ExclamationTriangleIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    {nameError}
                  </div>
                )}

                {customAgentName !== agentToAdd.name && !nameError && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)'
                  }}>
                    Original name: {agentToAdd.name}
                  </div>
                )}
              </div>

              {/* Required Egress Section */}
              {agentToAdd.required_egress && agentToAdd.required_egress.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Required Network Access
                  </label>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem'
                  }}>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                      This agent requires access to the following URLs:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {agentToAdd.required_egress.map((url, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          <code style={{ fontSize: '0.875rem' }}>{url}</code>
                        </li>
                      ))}
                    </ul>

                    {/* Network Access Approval Checkbox */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      marginTop: '0.75rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={hasApprovedEgress}
                        onChange={(e) => setHasApprovedEgress(e.target.checked)}
                        style={{
                          marginTop: '0.25rem',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>
                        I approve network access to the destinations listed above
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Acknowledgements Section */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--border)'
                  }}></div>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Acknowledgement
                  </label>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--border)'
                  }}></div>
                </div>

                {/* Third-Party Software Acknowledgment Checkbox */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  <input
                    type="checkbox"
                    checked={hasAcknowledged}
                    onChange={(e) => setHasAcknowledged(e.target.checked)}
                    style={{
                      marginTop: '0.25rem',
                      width: '1rem',
                      height: '1rem',
                      cursor: 'pointer'
                    }}
                  />
                  <span>
                    I understand that this third-party software has not been reviewed or endorsed by AgentSystems.
                  </span>
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className="btn btn-lg btn-ghost"
                onClick={() => {
                  setAgentToAdd(null)
                  setCustomAgentName('')
                  setNameError(null)
                  setHasAcknowledged(false)
                  setHasApprovedEgress(false)
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-lg btn-bright"
                onClick={confirmAddAgent}
                disabled={
                  !customAgentName.trim() ||
                  !hasAcknowledged ||
                  ((agentToAdd.required_egress?.length ?? 0) > 0 && !hasApprovedEgress)
                }
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {agentToRemove && (
        <div className={styles.modalOverlay} onClick={() => setAgentToRemove(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Remove Agent</h2>
                <p className={styles.modalDeveloper}>
                  {agentToRemove.name} by @{agentToRemove.developer}
                </p>
              </div>
              <button className={styles.closeButton} onClick={() => setAgentToRemove(null)}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalDescription}>
                <p>{agentToRemove.description}</p>
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem'
              }}>
                <p style={{ marginBottom: '0.75rem', fontWeight: 500 }}>
                  <ExclamationTriangleIcon style={{ width: '1.25rem', height: '1.25rem', display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                  Are you sure you want to remove this agent?
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <li>The agent will be removed from your configuration</li>
                  <li>You will need to restart AgentSystems to stop the agent container</li>
                  <li>Any data or state specific to this agent may be lost</li>
                </ul>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className="btn btn-lg btn-ghost"
                onClick={() => setAgentToRemove(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-lg btn-subtle"
                onClick={confirmRemoveAgent}
                style={{ color: 'var(--error)' }}
              >
                Remove Agent
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

// Agent Card Component
interface AgentCardProps {
  agent: IndexAgent
  onClick: () => void
  onDeveloperClick: (developerName: string, indexUrl: string) => void
  onAdd: () => void
  onRemove: () => void
  isAdded: boolean
}

function AgentCard({ agent, onClick, onDeveloperClick, onAdd, onRemove, isAdded }: AgentCardProps) {
  return (
    <Card className={styles.agentCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <h3>{agent.name}</h3>
      </div>

      <div className={styles.developerInfo}>
        {agent.developer_avatar_url || agent.developer ? (
          <img
            src={agent.developer_avatar_url || `https://github.com/${agent.developer}.png?size=40`}
            alt={agent.developer}
            className={styles.developerAvatar}
            title={agent.developer_name || agent.developer}
          />
        ) : (
          <div className={styles.developerAvatarPlaceholder}>
            {agent.developer.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={styles.developerLabel}>by </span>
        <button
          className={styles.developerLink}
          onClick={(e) => {
            e.stopPropagation()
            if (agent._index_url) {
              onDeveloperClick(agent.developer, agent._index_url)
            }
          }}
          title={agent.developer_name !== agent.developer ? agent.developer_name : undefined}
        >
          @{agent.developer}
        </button>
      </div>

      <p className={styles.description}>{agent.description}</p>

      <div className={styles.cardMeta}>
        {agent._index_name && (
          <span className={styles.indexBadge}>
            <GlobeAltIcon className={styles.indexIcon} />
            {agent._index_name}
          </span>
        )}
        {agent.image_repository_url && (
          <span className={styles.imageRepo}>
            {agent.image_repository_url.replace('docker.io/', '')}
          </span>
        )}
      </div>

      <div className={styles.cardActions}>
        {agent.source_repository_url && (
          <a
            href={agent.source_repository_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-ghost"
            onClick={(e) => e.stopPropagation()}
          >
            View Source
          </a>
        )}
        {isAdded ? (
          <button
            className="btn btn-sm btn-subtle"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            Remove
          </button>
        ) : (
          <button
            className="btn btn-sm btn-subtle"
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
          >
            Add
          </button>
        )}
      </div>
    </Card>
  )
}

// Agent Detail Modal Component
interface AgentDetailModalProps {
  agent: IndexAgent
  onClose: () => void
  onBack?: () => void
  onDeveloperClick: (developerName: string, indexUrl: string) => void
  onAdd: () => void
  onRemove: () => void
  isAdded: boolean
}

function AgentDetailModal({ agent, onClose, onBack, onDeveloperClick, onAdd, onRemove, isAdded }: AgentDetailModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            {onBack && (
              <div className={styles.backLink} onClick={onBack}>
                <ArrowLeftIcon className={styles.backIcon} />
                Back to Developer
              </div>
            )}
            <h2>{agent.name}</h2>
            <p className={styles.modalDeveloper}>
              by{' '}
              <button
                className={styles.developerLink}
                onClick={() => {
                  if (agent._index_url) {
                    onDeveloperClick(agent.developer, agent._index_url)
                  }
                }}
                title={agent.developer_name !== agent.developer ? agent.developer_name : undefined}
              >
                @{agent.developer}
              </button>
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalDescription}>
            <p>{agent.description}</p>
          </div>

          {/* Agent Details */}
          {(agent.context || agent.primary_function || agent.readiness_level) && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><CpuChipIcon />Agent Details</h4>
                <ul>
                  {agent.context && (
                    <li>
                      <strong>Context:</strong>{' '}
                      <span className={styles.badge}>{agent.context}</span>
                    </li>
                  )}
                  {agent.primary_function && (
                    <li>
                      <strong>Primary Function:</strong>{' '}
                      <span className={styles.badge}>{agent.primary_function}</span>
                    </li>
                  )}
                  {agent.readiness_level && (
                    <li>
                      <strong>Readiness:</strong>{' '}
                      <span className={styles.badge}>{agent.readiness_level}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Requirements */}
          {((agent.model_requirements && agent.model_requirements.length > 0) || (agent.required_egress && agent.required_egress.length > 0)) && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><WrenchScrewdriverIcon />Requirements</h4>
                {agent.model_requirements && agent.model_requirements.length > 0 && (
                  <>
                    <strong style={{ display: 'block', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Model Requirements:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {agent.model_requirements.map((model, index) => (
                        <code key={index} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                          {model}
                        </code>
                      ))}
                    </div>
                  </>
                )}
                {agent.required_egress && agent.required_egress.length > 0 && (
                  <>
                    <strong style={{ display: 'block', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Network Access:</strong>
                    <ul className={styles.nestedList}>
                      {agent.required_egress.map((url, index) => (
                        <li key={index}>
                          <code style={{ fontSize: '0.875rem' }}>{url}</code>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Input Parameters */}
          {agent.input_schema && Object.keys(agent.input_schema).length > 0 && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><CodeBracketIcon />Input Parameters</h4>
                <ul>
                  {Object.entries(agent.input_schema).map(([fieldName, fieldConfig]) => (
                    <li key={fieldName} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <code style={{ fontWeight: 600 }}>{fieldName}</code>
                        {fieldConfig.required ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>required</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>optional</span>
                        )}
                      </div>
                      {fieldConfig.label && (
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {fieldConfig.label}
                        </div>
                      )}
                      {fieldConfig.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {fieldConfig.description}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Type: {fieldConfig.type}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Input/Output Types */}
          {((agent.input_types && agent.input_types.length > 0) || (agent.output_types && agent.output_types.length > 0)) && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><DocumentTextIcon />Data Types</h4>
                {agent.input_types && agent.input_types.length > 0 && (
                  <>
                    <strong style={{ display: 'block', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Input Types:</strong>
                    <ul className={styles.nestedList}>
                      {agent.input_types.map((type, index: number) => (
                        <li key={index}>
                          <strong>{type.type}:</strong> {type.mime_types?.join(', ') || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {agent.output_types && agent.output_types.length > 0 && (
                  <>
                    <strong style={{ display: 'block', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Output Types:</strong>
                    <ul className={styles.nestedList}>
                      {agent.output_types.map((type, index: number) => (
                        <li key={index}>
                          <strong>{type.type}:</strong> {type.mime_types?.join(', ') || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Facets - Agent Characteristics */}
          {agent.facets && Object.keys(agent.facets).length > 0 && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><LightBulbIcon />Agent Characteristics</h4>
                <ul>
                  {(agent.facets.autonomy as string | undefined) && (
                    <li>
                      <strong>Autonomy Level:</strong>{' '}
                      <span className={styles.badge}>{String(agent.facets.autonomy)}</span>
                    </li>
                  )}
                  {(agent.facets.risk_tier as string | undefined) && (
                    <li>
                      <strong>Risk Tier:</strong>{' '}
                      <span className={styles.badge}>{String(agent.facets.risk_tier)}</span>
                    </li>
                  )}
                  {(agent.facets.latency as string | undefined) && (
                    <li>
                      <strong>Latency:</strong>{' '}
                      <span className={styles.badge}>{String(agent.facets.latency)}</span>
                    </li>
                  )}
                  {(agent.facets.cost_profile as string | undefined) && (
                    <li>
                      <strong>Cost:</strong>{' '}
                      <span className={styles.badge}>{String(agent.facets.cost_profile)}</span>
                    </li>
                  )}
                  {Array.isArray(agent.facets.domains) && agent.facets.domains.length > 0 && (
                    <li>
                      <strong>Domains:</strong>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {(agent.facets.domains as string[]).map((domain, index) => (
                          <span key={index} className={styles.badge}>{domain}</span>
                        ))}
                      </div>
                    </li>
                  )}
                  {Array.isArray(agent.facets.modalities) && agent.facets.modalities.length > 0 && (
                    <li>
                      <strong>Modalities:</strong>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {(agent.facets.modalities as string[]).map((modality, index) => (
                          <span key={index} className={styles.badge}>{modality}</span>
                        ))}
                      </div>
                    </li>
                  )}
                  {Array.isArray(agent.facets.model_tooling) && agent.facets.model_tooling.length > 0 && (
                    <li>
                      <strong>Model Tooling:</strong>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {(agent.facets.model_tooling as string[]).map((tool, index) => (
                          <span key={index} className={styles.badge}>{tool}</span>
                        ))}
                      </div>
                    </li>
                  )}
                  {Array.isArray(agent.facets.industries) && agent.facets.industries.length > 0 && (
                    <li>
                      <strong>Industries:</strong>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {(agent.facets.industries as string[]).map((industry, index) => (
                          <span key={index} className={styles.badge}>{industry}</span>
                        ))}
                      </div>
                    </li>
                  )}
                  {Array.isArray(agent.facets.integrations) && agent.facets.integrations.length > 0 && (
                    <li>
                      <strong>Integrations:</strong>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {(agent.facets.integrations as string[]).map((integration, index) => (
                          <span key={index} className={styles.badge}>{integration}</span>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {agent.image_repository_url && agent.image_repository_access === 'public' && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><CubeIcon />Image Repository</h4>
                <ul>
                  <li>
                    <strong>URL:</strong>{' '}
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{agent.image_repository_url}</span>
                  </li>
                  <li>
                    <strong>Access:</strong> Public (open access)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {agent.source_repository_url && agent.source_repository_access === 'public' && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><CodeBracketIcon />Source Repository</h4>
                <ul>
                  <li>
                    <strong>URL:</strong>{' '}
                    <a href={agent.source_repository_url} target="_blank" rel="noopener noreferrer">
                      {agent.source_repository_url}
                    </a>
                  </li>
                  <li>
                    <strong>Access:</strong> Public (open source)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {agent._index_name && (
            <div className={styles.modalSpecs}>
              <div className={styles.specGroup}>
                <h4><GlobeAltIcon />Index Information</h4>
                <ul>
                  <li>
                    <strong>Index:</strong> {agent._index_name}
                  </li>
                  <li>
                    <strong>Developer:</strong> @{agent.developer}
                  </li>
                  <li>
                    <strong>Listed:</strong> {new Date(agent.created_at).toLocaleDateString()}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-lg btn-ghost" onClick={onClose}>
            Close
          </button>
          {agent.source_repository_url && (
            <a
              href={agent.source_repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-subtle"
            >
              View Source
            </a>
          )}
          {isAdded ? (
            <button className="btn btn-lg btn-subtle" onClick={onRemove}>
              Remove
            </button>
          ) : (
            <button className="btn btn-lg btn-subtle" onClick={onAdd}>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Developer Detail Modal Component
interface DeveloperModalProps {
  developer: DeveloperInfo
  agents: IndexAgent[]
  onClose: () => void
  onAgentClick: (agent: IndexAgent) => void
  onViewAll: () => void
  isLoading: boolean
}

function DeveloperModal({ developer, agents, onClose, onAgentClick, onViewAll, isLoading }: DeveloperModalProps) {
  const previewAgents = agents.slice(0, 3)
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.developerHeaderInfo}>
            {developer.avatar_url || developer.id ? (
              <img
                src={developer.avatar_url || `https://github.com/${developer.id}.png?size=80`}
                alt={developer.id}
                className={styles.developerAvatar}
                title={developer.name !== developer.id ? developer.name : undefined}
              />
            ) : (
              <div className={styles.developerAvatarPlaceholder}>
                {developer.id.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2>@{developer.id}</h2>
              {developer.name && developer.name !== developer.id && (
                <p className={styles.modalDeveloperFullName}>
                  {developer.name}
                </p>
              )}
              <p className={styles.modalDeveloper}>
                {developer.agent_count} {developer.agent_count === 1 ? 'agent' : 'agents'}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading developer info...</p>
            </div>
          ) : (
            <>
              {/* About Section */}
              {(developer.tagline || developer.bio || developer.developer_type || developer.company || developer.location || developer.years_experience) && (
                <div className={styles.modalSpecs}>
                  <div className={styles.specGroup}>
                    <h4><UserIcon />About</h4>
                    <ul>
                      {developer.tagline && (
                        <li>
                          <strong><ChatBubbleLeftRightIcon />Tagline</strong>
                          <span>{developer.tagline}</span>
                        </li>
                      )}
                      {developer.bio && (
                        <li>
                          <strong><IdentificationIcon />Bio</strong>
                          <span>{developer.bio}</span>
                        </li>
                      )}
                      {developer.developer_type && (
                        <li>
                          <strong><BriefcaseIcon />Type</strong>
                          <span>{developer.developer_type}</span>
                        </li>
                      )}
                      {developer.company && (
                        <li>
                          <strong><BuildingOfficeIcon />Company</strong>
                          <span>{developer.company}</span>
                        </li>
                      )}
                      {developer.location && (
                        <li>
                          <strong><MapPinIcon />Location</strong>
                          <span>{developer.location}</span>
                        </li>
                      )}
                      {developer.years_experience && (
                        <li>
                          <strong><CalendarIcon />Experience</strong>
                          <span>{developer.years_experience} years</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Contact & Links Section */}
              {(developer.website || developer.support_email || developer.documentation_url) && (
                <div className={styles.modalSpecs}>
                  <div className={styles.specGroup}>
                    <h4><GlobeAltIcon />Contact & Links</h4>
                    <ul>
                      {developer.website && (
                        <li>
                          <strong><GlobeAltIcon />Website</strong>
                          <a href={developer.website} target="_blank" rel="noopener noreferrer">
                            {developer.website}
                          </a>
                        </li>
                      )}
                      {developer.support_email && (
                        <li>
                          <strong><EnvelopeIcon />Support</strong>
                          <a href={`mailto:${developer.support_email}`}>{developer.support_email}</a>
                        </li>
                      )}
                      {developer.documentation_url && (
                        <li>
                          <strong><BookOpenIcon />Documentation</strong>
                          <a href={developer.documentation_url} target="_blank" rel="noopener noreferrer">
                            {developer.documentation_url}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Social Section */}
              {(developer.github_username || developer.twitter_handle || developer.linkedin_url || developer.discord_username) && (
                <div className={styles.modalSpecs}>
                  <div className={styles.specGroup}>
                    <h4><UserGroupIcon />Social</h4>
                    <ul>
                      {developer.github_username && (
                        <li>
                          <strong><LinkIcon />GitHub</strong>
                          <a href={`https://github.com/${developer.github_username}`} target="_blank" rel="noopener noreferrer">
                            @{developer.github_username}
                          </a>
                        </li>
                      )}
                      {developer.twitter_handle && (
                        <li>
                          <strong><LinkIcon />Twitter</strong>
                          <a href={`https://twitter.com/${developer.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                            @{developer.twitter_handle}
                          </a>
                        </li>
                      )}
                      {developer.linkedin_url && (
                        <li>
                          <strong><LinkIcon />LinkedIn</strong>
                          <a href={developer.linkedin_url} target="_blank" rel="noopener noreferrer">
                            View Profile
                          </a>
                        </li>
                      )}
                      {developer.discord_username && (
                        <li>
                          <strong><LinkIcon />Discord</strong>
                          <span>{developer.discord_username}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Professional Section */}
              {(developer.expertise || developer.featured_work || developer.open_to_collaboration || developer.sponsor_url) && (
                <div className={styles.modalSpecs}>
                  <div className={styles.specGroup}>
                    <h4><LightBulbIcon />Professional</h4>
                    {developer.expertise && developer.expertise.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                          <LightBulbIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                          Expertise
                        </strong>
                        <div className={styles.expertiseBadges}>
                          {developer.expertise.map((skill, index) => (
                            <span key={index} className={styles.expertiseBadge}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {developer.featured_work && developer.featured_work.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                          <FolderIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                          Featured Work
                        </strong>
                        <ul className={styles.nestedList}>
                          {developer.featured_work.map((work, index) => (
                            <li key={index}>
                              <a href={work} target="_blank" rel="noopener noreferrer">
                                {work}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {developer.open_to_collaboration === true && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span className={styles.collaborationBadge}>
                          <HandRaisedIcon style={{ width: '1rem', height: '1rem' }} />
                          Open to Collaboration
                        </span>
                      </div>
                    )}
                    {developer.sponsor_url && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                          <HeartIcon style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
                          Sponsor
                        </strong>
                        <a href={developer.sponsor_url} target="_blank" rel="noopener noreferrer">
                          {developer.sponsor_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Developer's Agents */}
              <div className={styles.modalSpecs}>
                <div className={styles.specGroup}>
                  <h4><CpuChipIcon />Published Agents</h4>
                  {agents.length === 0 ? (
                    <p>No agents found for this developer.</p>
                  ) : (
                    <>
                      <div className={styles.developerAgentsList}>
                        {previewAgents.map(agent => (
                          <div
                            key={agent.id}
                            className={styles.developerAgentItem}
                            onClick={() => onAgentClick(agent)}
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
                      </div>
                      <button
                        className={`btn btn-md btn-subtle ${styles.viewAllButton}`}
                        onClick={onViewAll}
                      >
                        View All
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-lg btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
