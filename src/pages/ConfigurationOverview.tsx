import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@stores/configStore'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import { useAudio } from '@hooks/useAudio'
import { useVersions } from '@hooks/useVersions'
import Card from '@components/common/Card'
import SystemStatusBanner from '@components/common/SystemStatusBanner'
import {
  KeyIcon,
  CpuChipIcon,
  ServerIcon,
  RocketLaunchIcon,
  LinkIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import styles from './ConfigurationOverview.module.css'

interface ConfigCardProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  status: 'healthy' | 'warning' | 'error'
  statusText: string
  description: string
  href: string
  onClick: () => void
}

function ConfigCard({ title, icon: Icon, status, statusText, description, onClick, tourId }: ConfigCardProps & { tourId?: string }) {
  const statusIcon = {
    healthy: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon
  }[status]

  const StatusIcon = statusIcon

  return (
    <Card onClick={onClick} data-tour={tourId}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Icon className={styles.cardIcon} />
          <span>{title}</span>
        </div>
        <div className={`${styles.statusIndicator} ${styles[status]}`}>
          <StatusIcon className={styles.statusIcon} />
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.statusText}>{statusText}</div>
        <div className={styles.description}>{description}</div>
      </div>
      
      <div className={styles.cardAction}>
        <span>Manage</span>
        <ChevronRightIcon className={styles.chevron} />
      </div>
    </Card>
  )
}

export default function ConfigurationOverview() {
  const navigate = useNavigate()
  const { playClickSound } = useAudio()
  
  const {
    getRegistryConnections,
    getIndexConnections,
    getAgents,
    getEnvVars,
    getModelConnections,
    getReferencedEnvVars,
    loadConfig,
    isLoading,
    error,
    lastSaved
  } = useConfigStore()
  
  const { gatewayUrl, token } = useAuthStore()
  const { theme } = useThemeStore()
  const { ui_version, gateway_version, latest_versions, update_available } = useVersions()

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const handleCardClick = (path: string) => {
    playClickSound()
    navigate(path)
  }

  // Calculate status for each configuration area
  const registries = getRegistryConnections()
  const indexes = getIndexConnections()
  const agents = getAgents()
  const credentials = getEnvVars()
  const modelConnections = getModelConnections()
  getReferencedEnvVars()

  // Connection Status
  const connectionStatus = (() => {
    if (!gatewayUrl || !token) return { status: 'error' as const, text: 'Not configured', description: 'Missing gateway URL or auth token' }
    // Accept both full URLs (http/https) and development proxy path (/api)
    if (!gatewayUrl.match(/^https?:\/\//) && gatewayUrl !== '/api') return { status: 'warning' as const, text: 'Invalid URL', description: 'Gateway URL format is invalid' }
    return { status: 'healthy' as const, text: 'Connected', description: gatewayUrl }
  })()

  // Credentials Status  
  const credentialsStatus = (() => {
    if (credentials.length === 0) return { status: 'warning' as const, text: 'No credentials', description: 'Add environment variables for registry authentication' }
    return { status: 'healthy' as const, text: `${credentials.length} variables`, description: 'Environment variables configured' }
  })()

  // Models Status
  const modelsStatus = (() => {
    if (modelConnections.length === 0) return { status: 'warning' as const, text: 'No models', description: 'Add model connections for agent routing' }
    const disabled = modelConnections.filter(m => !m.enabled)
    const enabled = modelConnections.filter(m => m.enabled)
    if (enabled.length === 0) return { status: 'error' as const, text: 'All disabled', description: 'Enable at least one model connection' }
    if (disabled.length > 0) return { status: 'warning' as const, text: `${enabled.length} enabled`, description: `${disabled.length} models disabled` }
    return { status: 'healthy' as const, text: `${modelConnections.length} connected`, description: 'All model connections enabled and ready' }
  })()

  // Index Connections Status
  const indexesStatus = (() => {
    if (indexes.length === 0) return { status: 'warning' as const, text: 'No indexes', description: 'Add index connections to discover community agents' }
    const disabled = indexes.filter(i => !i.enabled)
    const enabled = indexes.filter(i => i.enabled)
    if (enabled.length === 0) return { status: 'warning' as const, text: 'All disabled', description: `${indexes.length} indexes configured but not enabled` }
    if (disabled.length > 0) return { status: 'healthy' as const, text: `${enabled.length} enabled`, description: `${disabled.length} indexes disabled` }
    return { status: 'healthy' as const, text: `${indexes.length} connected`, description: 'All index connections enabled' }
  })()

  // Registries Status
  const registriesStatus = (() => {
    if (registries.length === 0) return { status: 'error' as const, text: 'No registries', description: 'Add registry connections to deploy agents' }
    const disabled = registries.filter(r => !r.enabled)
    const enabled = registries.filter(r => r.enabled)
    if (enabled.length === 0) return { status: 'error' as const, text: 'All disabled', description: 'Enable at least one registry connection' }
    if (disabled.length > 0) return { status: 'warning' as const, text: `${enabled.length} enabled`, description: `${disabled.length} registries disabled` }
    return { status: 'healthy' as const, text: `${registries.length} connected`, description: 'All registries enabled and ready' }
  })()

  // Agents Status
  const agentsStatus = (() => {
    if (agents.length === 0) return { status: 'warning' as const, text: 'No agents', description: 'Configure your first agent deployment' }
    const missingRegistries = agents.filter(a => !registries.find(r => r.id === a.registry_connection && r.enabled))
    if (missingRegistries.length > 0) return { status: 'error' as const, text: `${agents.length} configured`, description: `${missingRegistries.length} agents have missing registries` }
    return { status: 'healthy' as const, text: `${agents.length} configured`, description: 'All agents ready for deployment' }
  })()

  // Appearance Status
  const appearanceStatus = (() => {
    return { status: 'healthy' as const, text: `${theme} theme`, description: 'UI preferences configured' }
  })()

  // Overall system status
  const overallStatus = (() => {
    const statuses = [connectionStatus, credentialsStatus, modelsStatus, registriesStatus, agentsStatus]
    const hasError = statuses.some(s => s.status === 'error')
    const hasWarning = statuses.some(s => s.status === 'warning')
    
    if (hasError) return { status: 'error' as const, message: 'Configuration issues need attention' }
    if (hasWarning) return { status: 'warning' as const, message: 'Some configuration areas need setup' }
    return { status: 'healthy' as const, message: 'All systems configured and ready' }
  })()

  if (isLoading) {
    return (
      <div className={styles.configurationOverview}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.configurationOverview}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <div>
              <h1>Configuration</h1>
              <p className={styles.subtitle}>
                Manage all platform settings and connections
              </p>
            </div>
            <a
              href="https://docs.agentsystems.ai/configuration"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
              title="View documentation"
            >
              <QuestionMarkCircleIcon className={styles.docsIcon} />
              <span>View Docs</span>
            </a>
          </div>
        </div>

        {lastSaved && (
          <div className={styles.lastSaved}>
            Last updated: {lastSaved instanceof Date ? lastSaved.toLocaleString() : new Date(lastSaved).toLocaleString()}
          </div>
        )}
      </div>

      {/* System Status Banner */}
      <SystemStatusBanner
        status={overallStatus.status}
        title="System Status"
        message={overallStatus.message}
      />

      {error && (
        <Card className={styles.errorCard}>
          <div className={styles.error}>
            <ExclamationTriangleIcon />
            <div>
              <h3>Configuration Error</h3>
              <p>{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Configuration Categories */}
      <div className={styles.configCategories}>
        {/* Connections */}
        <div className={styles.configCategory}>
          <h2 className={styles.categoryTitle}>
            Connections
          </h2>
          <p className={styles.categoryDescription}>
            Configure external connections for AI models, agent discovery, registries, and deployments
          </p>

          <div className={styles.categoryCards}>
            <ConfigCard
              title="Model Connections"
              icon={CpuChipIcon}
              status={modelsStatus.status}
              statusText={modelsStatus.text}
              description={modelsStatus.description}
              href="/configuration/model-connections"
              onClick={() => handleCardClick('/configuration/model-connections')}
              tourId="model-connections-card"
            />

            <ConfigCard
              title="Index Connections"
              icon={GlobeAltIcon}
              status={indexesStatus.status}
              statusText={indexesStatus.text}
              description={indexesStatus.description}
              href="/configuration/index-connections"
              onClick={() => handleCardClick('/configuration/index-connections')}
              tourId="index-connections-card"
            />

            <ConfigCard
              title="Registry Connections"
              icon={ServerIcon}
              status={registriesStatus.status}
              statusText={registriesStatus.text}
              description={registriesStatus.description}
              href="/configuration/registry-connections"
              onClick={() => handleCardClick('/configuration/registry-connections')}
              tourId="registry-connections-card"
            />

            <ConfigCard
              title="Agent Connections"
              icon={RocketLaunchIcon}
              status={agentsStatus.status}
              statusText={agentsStatus.text}
              description={agentsStatus.description}
              href="/configuration/agent-connections"
              onClick={() => handleCardClick('/configuration/agent-connections')}
              tourId="agent-connections-card"
            />
          </div>
        </div>

        {/* System */}
        <div className={styles.configCategory}>
          <h2 className={styles.categoryTitle}>
            System
          </h2>
          <p className={styles.categoryDescription}>
            Configure platform settings, gateway connection, credentials, and UI preferences
          </p>

          <div className={styles.categoryCards}>
            <ConfigCard
              title="Gateway Connection"
              icon={LinkIcon}
              status={connectionStatus.status}
              statusText={connectionStatus.text}
              description={connectionStatus.description}
              href="/configuration/connection"
              onClick={() => handleCardClick('/configuration/connection')}
            />

            <ConfigCard
              title="Credentials"
              icon={KeyIcon}
              status={credentialsStatus.status}
              statusText={credentialsStatus.text}
              description={credentialsStatus.description}
              href="/configuration/credentials"
              onClick={() => handleCardClick('/configuration/credentials')}
              tourId="credentials-card"
            />

            <ConfigCard
              title="Appearance"
              icon={PaintBrushIcon}
              status={appearanceStatus.status}
              statusText={appearanceStatus.text}
              description={appearanceStatus.description}
              href="/configuration/appearance"
              onClick={() => handleCardClick('/configuration/appearance')}
            />
          </div>
        </div>

      </div>

      {/* About Section */}
      <Card>
        <h2>About</h2>
        <div className={styles.about}>
          <div className={styles.aboutRow}>
            <span>User Interface (UI) Version</span>
            <div className={styles.versionInfo}>
              <span className={styles.mono}>{ui_version}</span>
              {(update_available.ui || ui_version === 'unknown') && (
                <ArrowPathIcon 
                  className={styles.updateIcon}
                  title={`Update available: ${latest_versions.ui}`}
                  aria-label={`Update available to ${latest_versions.ui}`}
                />
              )}
            </div>
          </div>
          <div className={styles.aboutRow}>
            <span>Agent Control Plane (ACP) Version</span>
            <div className={styles.versionInfo}>
              <span className={styles.mono}>{gateway_version}</span>
              {(update_available.gateway || gateway_version === 'unknown') && (
                <ArrowPathIcon 
                  className={styles.updateIcon}
                  title={`Update available: ${latest_versions.gateway}`}
                  aria-label={`Update available to ${latest_versions.gateway}`}
                />
              )}
            </div>
          </div>
          <div className={styles.aboutRow}>
            <span>Gateway</span>
            <span className={styles.mono}>{gatewayUrl}</span>
          </div>
          <div className={styles.aboutRow}>
            <span>Documentation</span>
            <a href="https://github.com/agentsystems/agentsystems" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}