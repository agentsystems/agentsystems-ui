import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useAudio } from '../../hooks/useAudio'
import { useToast } from '../../hooks/useToast'
import { validateSettings } from '../../utils/validation'
import { sanitizeUrl, sanitizeToken, rateLimiter } from '../../utils/security'
import Card from '../../components/common/Card'
import Toast from '../../components/Toast'
import {
  CheckIcon,
  LinkIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import styles from './ConnectionPage.module.css'

export default function ConnectionPage() {
  const { token, gatewayUrl, setToken, setGatewayUrl } = useAuthStore()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const [localToken, setLocalToken] = useState(token || '')
  const [localGatewayUrl, setLocalGatewayUrl] = useState(gatewayUrl)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSave = () => {
    playClickSound()
    
    // Rate limiting to prevent spam
    if (!rateLimiter.isAllowed('settings-save', 5, 60000)) {
      showError('Too many save attempts. Please wait a moment before trying again.')
      return
    }
    
    // Sanitize inputs before validation
    const sanitizedUrl = sanitizeUrl(localGatewayUrl)
    const sanitizedToken = sanitizeToken(localToken)
    
    if (sanitizedUrl !== localGatewayUrl) {
      showError('Gateway URL contains invalid characters and was cleaned.')
      setLocalGatewayUrl(sanitizedUrl)
      return
    }
    
    if (sanitizedToken !== localToken) {
      showError('Auth token contains invalid characters and was cleaned.')
      setLocalToken(sanitizedToken)
      return
    }
    
    // Validate form
    const validation = validateSettings(sanitizedUrl, sanitizedToken)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      showError('Please fix the validation errors before saving')
      return
    }
    
    // Clear any previous errors
    setErrors({})
    
    try {
      setToken(sanitizedToken)
      setGatewayUrl(sanitizedUrl)
      showSuccess('Connection settings saved successfully!')
    } catch (error) {
      showError('Failed to save settings. Please try again.')
    }
  }

  const testConnection = async () => {
    playClickSound()
    
    if (!localGatewayUrl || !localToken) {
      showError('Please configure both gateway URL and auth token first')
      return
    }

    try {
      // Test the connection by making a simple API call
      const response = await fetch(`${localGatewayUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${localToken}`
        }
      })
      
      if (response.ok) {
        showSuccess('Connection test successful!')
      } else {
        showError(`Connection test failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      showError(`Connection test failed: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }

  return (
    <div className={styles.connectionPage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Connection</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Gateway Connection</h1>
          <p>Configure connection to your AgentSystems gateway</p>
        </div>
      </div>

      <Card>
        <div className={styles.form}>
          <h2>
            <LinkIcon />
            Connection Settings
          </h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="gateway-url">Gateway URL</label>
            <input
              id="gateway-url"
              type="text"
              value={localGatewayUrl}
              onChange={(e) => {
                setLocalGatewayUrl(e.target.value)
                if (errors.gatewayUrl) {
                  setErrors(prev => ({ ...prev, gatewayUrl: '' }))
                }
              }}
              className={`${styles.input} ${errors.gatewayUrl ? styles.inputError : ''}`}
              aria-describedby="gateway-url-hint gateway-url-error"
              aria-invalid={!!errors.gatewayUrl}
              placeholder="http://localhost:18080"
              required
            />
            {errors.gatewayUrl && (
              <span className={styles.errorText} id="gateway-url-error" role="alert">
                {errors.gatewayUrl}
              </span>
            )}
            <span className={styles.hint} id="gateway-url-hint">
              The URL of your AgentSystems gateway
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="auth-token">Auth Token</label>
            <input
              id="auth-token"
              type="password"
              value={localToken}
              onChange={(e) => {
                setLocalToken(e.target.value)
                if (errors.token) {
                  setErrors(prev => ({ ...prev, token: '' }))
                }
              }}
              className={`${styles.input} ${errors.token ? styles.inputError : ''}`}
              aria-describedby="auth-token-hint auth-token-error"
              aria-invalid={!!errors.token}
              placeholder="Enter your auth token"
              required
            />
            {errors.token && (
              <span className={styles.errorText} id="auth-token-error" role="alert">
                {errors.token}
              </span>
            )}
            <span className={styles.hint} id="auth-token-hint">
              Bearer token for authentication
            </span>
          </div>

          <div className={styles.formActions}>
            <button 
              onClick={handleSave} 
              className="btn btn-lg btn-bright"
              aria-describedby="save-button-hint"
            >
              <CheckIcon />
              Save Connection Settings
            </button>
            
            <button 
              onClick={testConnection} 
              className="btn btn-lg btn-subtle"
              disabled={!localGatewayUrl || !localToken}
            >
              Test Connection
            </button>
          </div>
          
          <span className={styles.hint} id="save-button-hint">
            Apply changes to gateway URL and authentication token
          </span>
        </div>
      </Card>

      {/* Connection Status */}
      <Card>
        <h2>Connection Status</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Gateway URL:</span>
            <span className={styles.statusValue}>
              {gatewayUrl || 'Not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Authentication:</span>
            <span className={styles.statusValue}>
              {token ? 'Token configured' : 'No token'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Status:</span>
            <span className={`${styles.statusValue} ${gatewayUrl && token ? styles.statusHealthy : styles.statusWarning}`}>
              {gatewayUrl && token ? 'Ready' : 'Incomplete'}
            </span>
          </div>
        </div>
        
        {(!gatewayUrl || !token) && (
          <div className={styles.warning}>
            <ExclamationTriangleIcon />
            <span>Complete the connection configuration to use AgentSystems features</span>
          </div>
        )}
      </Card>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}