/**
 * Restart banner component - shows when configuration changes require platform restart
 * 
 * Provides unobtrusive notification about pending changes and easy restart trigger.
 * Tracks multiple changes and batches them for a single restart operation.
 */

import { useState } from 'react'
import { useConfigStore } from '@stores/configStore'
import { api } from '@api/client'
import { useToast } from '@hooks/useToast'
import { useAudio } from '@hooks/useAudio'
import LoadingSpinner from '@components/LoadingSpinner'
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
  const { showSuccess, showError } = useToast()
  const { playClickSound } = useAudio()

  const handleRestart = async () => {
    playClickSound()
    setIsRestarting(true)
    
    try {
      // Trigger automatic platform restart
      await api.post('/system/restart')
      showSuccess('Platform restart initiated')
      
      // Poll until gateway comes back online
      let attempts = 0
      const maxAttempts = 60 // 2 minutes max
      
      while (attempts < maxAttempts) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          await api.get('/health') // Test if gateway is back
          
          // Gateway is back - restart complete!
          clearRestartRequired()
          showSuccess('Platform restart completed successfully!')
          setIsRestarting(false)
          return
          
        } catch (error) {
          attempts++
          // Continue polling - gateway is expected to be down during restart
        }
      }
      
      // Timeout reached
      showError('Restart may have completed but gateway is not responding. Please check manually.')
      setIsRestarting(false)
      
    } catch (error) {
      console.error('Restart failed:', error)
      showError('Failed to initiate restart. Please try: agentsystems restart')
      setIsRestarting(false)
    }
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
          <LoadingSpinner />
          <div className={styles.restartingText}>
            <h3>Restarting Platform</h3>
            <p>Applying {changesSinceRestart.length} configuration change{changesSinceRestart.length !== 1 ? 's' : ''}...</p>
            <p className={styles.restartingHint}>This may take 30-60 seconds</p>
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