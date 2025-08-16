import { useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import { isAudioEnabled, setAudioEnabled } from '@utils/audioFx'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import { validateSettings } from '@utils/validation'
import { sanitizeUrl, sanitizeToken, rateLimiter } from '@utils/security'
import { APP_VERSION } from '@constants/app'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import styles from './Settings.module.css'

export default function Settings() {
  const { token, gatewayUrl, setToken, setGatewayUrl } = useAuthStore()
  const { theme, scanlineEnabled, scanlineFrequency, setTheme, setScanlineEnabled, setScanlineFrequency } = useThemeStore()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  const [audioEnabled, setAudioEnabledState] = useState(isAudioEnabled())
  
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
      showSuccess('Settings saved successfully!')
    } catch (error) {
      showError('Failed to save settings. Please try again.')
    }
  }

  const handleAudioToggle = (enabled: boolean) => {
    setAudioEnabled(enabled)
    setAudioEnabledState(enabled)
  }

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p className={styles.subtitle}>Configure your AgentSystems UI</p>
      </div>

      <div className={styles.sections}>
        <Card>
          <h2>Connection</h2>
          <div className={styles.form}>
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

            <button 
              onClick={handleSave} 
              className={styles.saveButton}
              aria-describedby="save-button-hint"
            >
              Save Connection Settings
            </button>
            <span className={styles.hint} id="save-button-hint">
              Apply changes to gateway URL and authentication token
            </span>
          </div>
        </Card>

        <Card>
          <h2>Appearance</h2>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value as 'dark' | 'light' | 'cyber')
                  e.target.blur() // Remove focus after selection
                }}
                className={styles.select}
              >
                <option value="dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="cyber">👾 Cyber</option>
              </select>
              <span className={styles.hint}>
                Choose your preferred color theme
              </span>
            </div>

            {theme === 'cyber' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={scanlineEnabled}
                      onChange={(e) => setScanlineEnabled(e.target.checked)}
                      className={styles.checkbox}
                    />
                    Enable matrix scanline effect
                  </label>
                  <span className={styles.hint}>
                    Adds periodic animated scanlines that move down the screen
                  </span>
                </div>

                {scanlineEnabled && (
                  <div className={styles.formGroup}>
                    <label htmlFor="scanline-frequency">Scanline Frequency</label>
                    <select
                      id="scanline-frequency"
                      value={scanlineFrequency}
                      onChange={(e) => {
                        setScanlineFrequency(e.target.value as '30' | '90' | '300')
                        e.target.blur() // Remove focus after selection
                      }}
                      className={styles.select}
                    >
                      <option value="30">Every ~30 seconds (frequent)</option>
                      <option value="90">Every ~90 seconds (moderate)</option>
                      <option value="300">Every ~5 minutes (subtle)</option>
                    </select>
                    <span className={styles.hint}>
                      How often scanlines appear (with random variation)
                    </span>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={audioEnabled}
                      onChange={(e) => handleAudioToggle(e.target.checked)}
                      className={styles.checkbox}
                    />
                    Enable sound effects
                  </label>
                  <span className={styles.hint}>
                    Plays digital click sounds for button interactions
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2>About</h2>
          <div className={styles.about}>
            <div className={styles.aboutRow}>
              <span>Version</span>
              <span className={styles.mono}>{APP_VERSION}</span>
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