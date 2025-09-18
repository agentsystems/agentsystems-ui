import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import { validateSettings } from '@utils/validation'
import { sanitizeUrl, sanitizeToken, rateLimiter } from '@utils/security'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
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
      console.log('URL normalized:', { 
        original: `"${localGatewayUrl}"`, 
        sanitized: `"${sanitizedUrl}"`,
        originalLength: localGatewayUrl.length,
        sanitizedLength: sanitizedUrl.length,
        charCodes: {
          original: localGatewayUrl.split('').map(c => c.charCodeAt(0)),
          sanitized: sanitizedUrl.split('').map(c => c.charCodeAt(0))
        }
      })
      setLocalGatewayUrl(sanitizedUrl)
    }
    
    if (sanitizedToken !== localToken) {
      console.log('Token sanitized:', {
        original: `"${localToken}"`,
        sanitized: `"${sanitizedToken}"`,
        originalLength: localToken.length,
        sanitizedLength: sanitizedToken.length
      })
      setLocalToken(sanitizedToken)
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
      
      // Always show simple success message
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
      // In development, use proxy route; in production, use direct URL
      const testUrl = import.meta.env.DEV ? '/api/health' : `${localGatewayUrl}/health`
      console.log('Testing connection to:', testUrl, '(original URL:', localGatewayUrl, ')')
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localToken}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors' // Explicitly handle CORS
      })
      
      if (response.ok) {
        showSuccess('Connection test successful!')
      } else {
        showError(`Connection test failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Connection test error:', error)
      let errorMessage = 'Network error'
      let suggestions = ''
      
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          errorMessage = 'Cannot reach the gateway URL'
          suggestions = 'Common causes:\n• Gateway is not running (try: agentsystems up)\n• Wrong URL (should be http://localhost:18080)\n• CORS issues (if running on different domain)'
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Cross-origin request blocked'
          suggestions = 'The gateway may not allow requests from this domain. Check CORS configuration.'
        } else {
          errorMessage = error.message
        }
      }
      
      showError(`Connection test failed: ${errorMessage}${suggestions ? '\n\n' + suggestions : ''}`)
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
              Bearer token for authentication. Default demo token provided - please change for production use.
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
      <Card className={styles.statusCard}>
        <h2>Current Connection Status</h2>
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

        {token === 'demo-token-please-change' && (
          <div className={styles.warning}>
            <ExclamationTriangleIcon />
            <span>Using demo token - please update with your a new token for production use</span>
          </div>
        )}
      </Card>

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