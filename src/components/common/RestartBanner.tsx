/**
 * Restart banner component - shows when configuration changes require platform restart
 * 
 * Provides unobtrusive notification about pending changes and easy restart trigger.
 * Tracks multiple changes and batches them for a single restart operation.
 */

import { useState } from 'react'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import {
  ArrowPathIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import styles from './RestartBanner.module.css'

export default function RestartBanner() {
  const { restartRequired, changesSinceRestart, clearRestartRequired } = useConfigStore()
  const [isRestarting, setIsRestarting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { playClickSound } = useAudio()

  const handleRestart = () => {
    playClickSound()
    setIsRestarting(true) // Use this state to show the command modal
  }

  const handleDismiss = () => {
    playClickSound()
    clearRestartRequired()
  }

  if (!restartRequired) {
    return null
  }

  if (isRestarting) {
    return (
      <div className={styles.restartBanner} role="alert" aria-live="polite">
        <div className={styles.restartingContent}>
          <div className={styles.restartingText}>
            <h3>Platform Restart Required</h3>
            <p>To apply {changesSinceRestart.length} configuration change{changesSinceRestart.length !== 1 ? 's' : ''}, please run:</p>
            
            <div style={{ 
              background: 'var(--surface-2)', 
              padding: '1rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)',
              margin: '1rem 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              <code>agentsystems restart</code>
            </div>
            
            <p className={styles.restartingHint}>Run this command in your deployment directory</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  clearRestartRequired()
                  setIsRestarting(false)
                  // Force page refresh to pick up platform changes
                  window.location.reload()
                }}
                className="btn btn-sm btn-bright"
              >
                Restart executed and completed
              </button>
              
              <button
                type="button"
                onClick={() => setIsRestarting(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.banner} role="alert" aria-label="Configuration changes require restart">
      <div className={styles.content}>
        <div className={styles.icon}>
          <ExclamationTriangleIcon />
        </div>
        
        <div className={styles.message}>
          <span className={styles.title}>
            Changes pending ({changesSinceRestart.length})
          </span>
          <span className={styles.subtitle}>
            Restart required to apply configuration changes
          </span>
          
          {showDetails && (
            <div className={styles.changesList}>
              <h4>Pending changes:</h4>
              <ul>
                {changesSinceRestart.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {changesSinceRestart.length > 1 && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-sm btn-ghost"
              aria-label={showDetails ? "Hide change details" : "Show change details"}
            >
              {showDetails ? 'Hide' : 'Details'}
            </button>
          )}
          
          <button
            type="button"
            onClick={handleRestart}
            className="btn btn-sm btn-bright"
            aria-label={`Restart platform to apply ${changesSinceRestart.length} pending changes`}
          >
            <ArrowPathIcon />
            Restart Platform
          </button>
          
          <button
            type="button"
            onClick={handleDismiss}
            className="btn btn-sm btn-ghost"
            aria-label="Dismiss restart notification"
            title="Changes will still require restart later"
          >
            <XMarkIcon />
          </button>
        </div>
      </div>
    </div>
  )
}