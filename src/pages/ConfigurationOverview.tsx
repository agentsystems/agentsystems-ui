import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '../stores/configStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useAudio } from '../hooks/useAudio'
import Card from '../components/common/Card'
import {
  KeyIcon,
  CpuChipIcon,
  ServerIcon,
  RocketLaunchIcon,
  LinkIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronRightIcon
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

function ConfigCard({ title, icon: Icon, status, statusText, description, href, onClick }: ConfigCardProps) {
  const statusIcon = {
    healthy: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon
  }[status]

  const StatusIcon = statusIcon

  return (
    <Card className={`${styles.configCard} ${styles[status]}`} onClick={onClick}>
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
    config,
    envVars,
    getRegistryConnections,
    getAgents,
    getEnvVars,
    getReferencedEnvVars,
    loadConfig,
    isLoading,
    error,
    lastSaved
  } = useConfigStore()
  
  const { gatewayUrl, token } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const handleCardClick = (path: string) => {
    playClickSound()
    navigate(path)
  }

  // Calculate status for each configuration area
  const registries = getRegistryConnections()
  const agents = getAgents()
  const credentials = getEnvVars()
  const referencedVars = getReferencedEnvVars()

  // Connection Status
  const connectionStatus = (() => {
    if (!gatewayUrl || !token) return { status: 'error' as const, text: 'Not configured', description: 'Missing gateway URL or auth token' }
    if (!gatewayUrl.match(/^https?:\/\//)) return { status: 'warning' as const, text: 'Invalid URL', description: 'Gateway URL format is invalid' }
    return { status: 'healthy' as const, text: 'Connected', description: gatewayUrl }
  })()

  // Credentials Status  
  const credentialsStatus = (() => {
    if (credentials.length === 0) return { status: 'warning' as const, text: 'No credentials', description: 'Add environment variables for registry authentication' }
    const unreferenced = credentials.filter(c => !referencedVars.has(c.key))
    if (unreferenced.length > 0) return { status: 'warning' as const, text: `${credentials.length} variables`, description: `${unreferenced.length} unused credentials` }
    return { status: 'healthy' as const, text: `${credentials.length} variables`, description: 'All credentials properly referenced' }
  })()

  // Models Status (placeholder - will be implemented)
  const modelsStatus = (() => {
    // TODO: Calculate based on actual model configuration
    return { status: 'warning' as const, text: 'Not configured', description: 'Model routing needs to be set up' }
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
          <h1>Configuration</h1>
          <p className={styles.subtitle}>
            Manage all platform settings and connections
          </p>
        </div>
        
        {lastSaved && (
          <div className={styles.lastSaved}>
            Last updated: {lastSaved instanceof Date ? lastSaved.toLocaleString() : new Date(lastSaved).toLocaleString()}
          </div>
        )}
      </div>

      {/* System Status Banner */}
      <Card className={`${styles.statusBanner} ${styles[overallStatus.status]}`}>
        <div className={styles.statusContent}>
          <div className={styles.statusInfo}>
            {overallStatus.status === 'healthy' && <CheckCircleIcon className={styles.statusBannerIcon} />}
            {overallStatus.status === 'warning' && <ExclamationTriangleIcon className={styles.statusBannerIcon} />}
            {overallStatus.status === 'error' && <XCircleIcon className={styles.statusBannerIcon} />}
            <div>
              <h3>System Status</h3>
              <p>{overallStatus.message}</p>
            </div>
          </div>
        </div>
      </Card>

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

      {/* Configuration Cards Grid */}
      <div className={styles.cardsGrid}>
        <ConfigCard
          title="Connection"
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
        />
        
        <ConfigCard
          title="Models"
          icon={CpuChipIcon}
          status={modelsStatus.status}
          statusText={modelsStatus.text}
          description={modelsStatus.description}
          href="/configuration/models"
          onClick={() => handleCardClick('/configuration/models')}
        />
        
        <ConfigCard
          title="Registries"
          icon={ServerIcon}
          status={registriesStatus.status}
          statusText={registriesStatus.text}
          description={registriesStatus.description}
          href="/configuration/registries"
          onClick={() => handleCardClick('/configuration/registries')}
        />
        
        <ConfigCard
          title="Agents"
          icon={RocketLaunchIcon}
          status={agentsStatus.status}
          statusText={agentsStatus.text}
          description={agentsStatus.description}
          href="/configuration/agents"
          onClick={() => handleCardClick('/configuration/agents')}
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

      {/* Quick Actions or Recent Activity could go here */}
      <Card className={styles.recentActivity}>
        <h3>Quick Setup Guide</h3>
        <div className={styles.setupSteps}>
          <div className={`${styles.step} ${connectionStatus.status === 'healthy' ? styles.completed : ''}`}>
            <CheckCircleIcon className={styles.stepIcon} />
            <span>1. Configure gateway connection</span>
          </div>
          <div className={`${styles.step} ${credentialsStatus.status === 'healthy' ? styles.completed : ''}`}>
            <CheckCircleIcon className={styles.stepIcon} />
            <span>2. Add authentication credentials</span>
          </div>
          <div className={`${styles.step} ${modelsStatus.status === 'healthy' ? styles.completed : ''}`}>
            <CheckCircleIcon className={styles.stepIcon} />
            <span>3. Configure model routing</span>
          </div>
          <div className={`${styles.step} ${registriesStatus.status === 'healthy' ? styles.completed : ''}`}>
            <CheckCircleIcon className={styles.stepIcon} />
            <span>4. Connect to registries</span>
          </div>
          <div className={`${styles.step} ${agentsStatus.status === 'healthy' ? styles.completed : ''}`}>
            <CheckCircleIcon className={styles.stepIcon} />
            <span>5. Deploy your agents</span>
          </div>
        </div>
      </Card>
    </div>
  )
}