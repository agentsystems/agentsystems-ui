import { useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import Card from '@components/common/Card'
import styles from './Settings.module.css'

export default function Settings() {
  const { token, gatewayUrl, setToken, setGatewayUrl } = useAuthStore()
  const { theme, scanlineEnabled, scanlineFrequency, setTheme, setScanlineEnabled, setScanlineFrequency } = useThemeStore()
  
  const [localToken, setLocalToken] = useState(token || '')
  const [localGatewayUrl, setLocalGatewayUrl] = useState(gatewayUrl)

  const handleSave = () => {
    setToken(localToken)
    setGatewayUrl(localGatewayUrl)
    alert('Settings saved!')
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
                onChange={(e) => setLocalGatewayUrl(e.target.value)}
                className={styles.input}
              />
              <span className={styles.hint}>
                The URL of your AgentSystems gateway
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="auth-token">Auth Token</label>
              <input
                id="auth-token"
                type="password"
                value={localToken}
                onChange={(e) => setLocalToken(e.target.value)}
                className={styles.input}
              />
              <span className={styles.hint}>
                Bearer token for authentication
              </span>
            </div>

            <button onClick={handleSave} className={styles.saveButton}>
              Save Connection Settings
            </button>
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
                onChange={(e) => setTheme(e.target.value as any)}
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
                      onChange={(e) => setScanlineFrequency(e.target.value as any)}
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
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2>About</h2>
          <div className={styles.about}>
            <div className={styles.aboutRow}>
              <span>Version</span>
              <span className={styles.mono}>0.1.0</span>
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
    </div>
  )
}