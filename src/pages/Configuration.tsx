import { useState, useEffect } from 'react'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import CredentialsTab from '@components/configuration/CredentialsTab'
import RegistriesTab from '@components/configuration/RegistriesTab'
import AgentsTab from '@components/configuration/AgentsTab'
import {
  DocumentTextIcon,
  ServerIcon,
  RocketLaunchIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import styles from './Configuration.module.css'

type TabType = 'credentials' | 'registries' | 'agents'

export default function Configuration() {
  const [activeTab, setActiveTab] = useState<TabType>('credentials')
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const {
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    lastSaved,
    loadConfig,
    saveConfig
  } = useConfigStore()

  useEffect(() => {
    // Load configuration when component mounts
    loadConfig()
  }, [loadConfig])

  const handleTabClick = (tab: TabType) => {
    playClickSound()
    setActiveTab(tab)
  }

  const handleSave = async () => {
    playClickSound()
    try {
      await saveConfig()
      showSuccess('Configuration saved successfully!')
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save configuration')
    }
  }

  const handleReload = () => {
    playClickSound()
    loadConfig()
  }

  if (isLoading) {
    return (
      <div className={styles.configuration}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.configuration}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Configuration</h1>
          <p className={styles.subtitle}>
            Manage registry connections, agents, and environment variables
          </p>
        </div>
        
        <div className={styles.headerActions}>
          {hasUnsavedChanges && (
            <div className={styles.unsavedIndicator}>
              <ExclamationTriangleIcon />
              <span>Unsaved changes</span>
            </div>
          )}
          
          {lastSaved && (
            <div className={styles.lastSaved}>
              Last saved: {lastSaved instanceof Date ? lastSaved.toLocaleTimeString() : new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          
          <button
            onClick={handleReload}
            className="btn btn-sm btn-subtle"
            disabled={isSaving}
            title="Reload configuration from files"
          >
            Reload
          </button>
          
          <button
            onClick={handleSave}
            className={`btn btn-sm ${hasUnsavedChanges ? 'btn-primary' : 'btn-subtle'}`}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? (
              <>
                <div className={styles.spinner} />
                Saving...
              </>
            ) : (
              <>
                <CloudArrowUpIcon />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

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

      <div className={styles.tabs}>
        <nav className={styles.tabNav} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'credentials'}
            aria-controls="credentials-panel"
            onClick={() => handleTabClick('credentials')}
            className={`${styles.tab} ${activeTab === 'credentials' ? styles.active : ''}`}
          >
            <DocumentTextIcon />
            <span>Credentials</span>
          </button>
          
          <button
            role="tab"
            aria-selected={activeTab === 'registries'}
            aria-controls="registries-panel"
            onClick={() => handleTabClick('registries')}
            className={`${styles.tab} ${activeTab === 'registries' ? styles.active : ''}`}
          >
            <ServerIcon />
            <span>Registries</span>
          </button>
          
          <button
            role="tab"
            aria-selected={activeTab === 'agents'}
            aria-controls="agents-panel"
            onClick={() => handleTabClick('agents')}
            className={`${styles.tab} ${activeTab === 'agents' ? styles.active : ''}`}
          >
            <RocketLaunchIcon />
            <span>Agents</span>
          </button>
        </nav>

        <div className={styles.tabContent}>
          <div
            id="credentials-panel"
            role="tabpanel"
            aria-labelledby="credentials-tab"
            className={`${styles.tabPanel} ${activeTab === 'credentials' ? styles.active : ''}`}
          >
            {activeTab === 'credentials' && <CredentialsTab />}
          </div>
          
          <div
            id="registries-panel"
            role="tabpanel"
            aria-labelledby="registries-tab"
            className={`${styles.tabPanel} ${activeTab === 'registries' ? styles.active : ''}`}
          >
            {activeTab === 'registries' && <RegistriesTab />}
          </div>
          
          <div
            id="agents-panel"
            role="tabpanel"
            aria-labelledby="agents-tab"
            className={`${styles.tabPanel} ${activeTab === 'agents' ? styles.active : ''}`}
          >
            {activeTab === 'agents' && <AgentsTab />}
          </div>
        </div>
      </div>

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