import { useState, useEffect } from 'react'
import { useConfigStore } from '@stores/configStore'
import { MagnifyingGlassIcon, GlobeAltIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Card from '@components/common/Card'
import styles from './Discover.module.css'

interface IndexAgent {
  id: string
  name: string
  description: string
  image_repository_url: string
  source_repository_url: string | null
  listing_status: string
  image_repository_access: string
  source_repository_access: string
  created_at: string
  developer_id: string
  developer: {
    id: string
    name: string
    avatar_url: string | null
  }
  _index_name?: string // Track which index this came from
}

export default function Discover() {
  const { getIndexConnections } = useConfigStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [agents, setAgents] = useState<IndexAgent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<string | 'all'>('all')

  const indexes = getIndexConnections()
  const enabledIndexes = indexes.filter(idx => idx.enabled)

  useEffect(() => {
    fetchAgents()
  }, [selectedIndex])

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
          const response = await fetch(`${index.url}/agents`)
          if (!response.ok) {
            throw new Error(`Failed to fetch from ${index.name}`)
          }
          const data = await response.json()
          // Tag each agent with the index it came from
          const agents = (data.agents || []).map((agent: IndexAgent) => ({
            ...agent,
            _index_name: index.name
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

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      agent.name?.toLowerCase().includes(query) ||
      agent.description?.toLowerCase().includes(query) ||
      agent.developer?.name?.toLowerCase().includes(query)
    )
  })

  const handleInstallAgent = (agent: IndexAgent) => {
    // TODO: Implement agent installation flow
    alert(`Installing ${agent.name} is not yet implemented. This will add the agent to your agentsystems-config.yml file.`)
  }

  if (enabledIndexes.length === 0) {
    return (
      <div className={styles.discover}>
        <div className={styles.header}>
          <div>
            <h1>Discover Agents</h1>
            <p className={styles.subtitle}>
              Browse and install community agents from connected indexes
            </p>
          </div>
          <a
            href="https://docs.agentsystems.ai/user-guide/discover-agents"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
            title="View documentation"
          >
            <QuestionMarkCircleIcon className={styles.docsIcon} />
            <span>View Docs</span>
          </a>
        </div>

        <Card className={styles.emptyStateCard}>
          <div className={styles.emptyState}>
            <GlobeAltIcon className={styles.emptyIcon} />
            <h3>No Index Connections Enabled</h3>
            <p>Enable at least one index connection to discover community agents.</p>
            <a href="/configuration/indexes" className="btn btn-lg btn-bright">
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
          <h1>Discover Agents</h1>
          <p className={styles.subtitle}>
            Browse and install community agents from {enabledIndexes.length} connected {enabledIndexes.length === 1 ? 'index' : 'indexes'}
          </p>
        </div>
        <a
          href="https://docs.agentsystems.ai/user-guide/discover-agents"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
          title="View documentation"
        >
          <QuestionMarkCircleIcon className={styles.docsIcon} />
          <span>View Docs</span>
        </a>
      </div>

      <div className={styles.disclaimer}>
        <ExclamationTriangleIcon />
        <div>
          <strong>Third-Party Agents:</strong> All agents listed here are provided by third-party developers. AgentSystems does not review, endorse, verify, or control any agents. You are solely responsible for reviewing agent code, permissions, network access, and security before installation. Install at your own risk.
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

        <div className={styles.indexFilter}>
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
        <section className={styles.section}>
          <h2>
            {searchQuery ? `Search Results (${filteredAgents.length})` : `All Agents (${filteredAgents.length})`}
          </h2>

          <div className={styles.agentGrid}>
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onInstall={() => handleInstallAgent(agent)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Agent Card Component
interface AgentCardProps {
  agent: IndexAgent
  onInstall: () => void
}

function AgentCard({ agent, onInstall }: AgentCardProps) {
  return (
    <Card className={styles.agentCard}>
      <div className={styles.cardHeader}>
        <h3>{agent.name}</h3>
      </div>

      <div className={styles.developerInfo}>
        <span className={styles.developerName}>
          by {agent.developer.name}
        </span>
      </div>

      <p className={styles.description}>{agent.description}</p>

      <div className={styles.cardMeta}>
        {agent._index_name && (
          <span className={styles.indexBadge}>
            <GlobeAltIcon className={styles.indexIcon} />
            {agent._index_name}
          </span>
        )}
        <span className={styles.imageRepo}>
          {agent.image_repository_url.replace('docker.io/', '')}
        </span>
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
        <button
          className="btn btn-sm btn-bright"
          onClick={(e) => {
            e.stopPropagation()
            onInstall()
          }}
        >
          Install
        </button>
      </div>
    </Card>
  )
}
