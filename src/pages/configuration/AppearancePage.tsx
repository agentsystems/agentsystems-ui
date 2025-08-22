/**
 * Appearance configuration page for UI preferences
 * 
 * Features:
 * - Theme selection (Dark, Light, Cyber)
 * - Audio preferences for cyber theme sound effects
 * - Cyber theme scanline frequency configuration
 * - Live preview of theme changes
 * - Accessibility compliance with ARIA labels
 */

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import { isAudioEnabled, setAudioEnabled } from '@utils/audioFx'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import { rateLimiter } from '@utils/security'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import styles from './AppearancePage.module.css'

export default function AppearancePage() {
  const { theme, scanlineEnabled, scanlineFrequency, setTheme, setScanlineEnabled, setScanlineFrequency } = useThemeStore()
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  const [audioEnabled, setAudioEnabledState] = useState(isAudioEnabled())

  const handleSave = () => {
    playClickSound()
    
    // Rate limiting to prevent spam
    if (!rateLimiter.isAllowed('appearance-save', 5, 60000)) {
      showError('Too many requests. Please wait before saving again.')
      return
    }

    try {
      // Audio setting
      setAudioEnabled(audioEnabled)
      
      showSuccess('Appearance settings saved successfully!')
    } catch (error) {
      console.error('Failed to save appearance settings:', error)
      showError('Failed to save appearance settings. Please try again.')
    }
  }

  const handleThemeChange = (newTheme: string) => {
    playClickSound()
    setTheme(newTheme)
  }

  const handleScanlineToggle = () => {
    playClickSound()
    setScanlineEnabled(!scanlineEnabled)
  }

  const handleScanlineFrequencyChange = (frequency: string) => {
    playClickSound()
    setScanlineFrequency(frequency)
  }

  const handleAudioToggle = () => {
    playClickSound()
    setAudioEnabledState(!audioEnabled)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Appearance</h1>
        <p>Customize the visual theme and audio preferences</p>
      </div>

      <div className={styles.content}>
        <Card>
          <h2>Theme</h2>
          <div className={styles.themeGrid}>
            {['dark', 'light', 'cyber'].map((themeOption) => (
              <div key={themeOption} className={styles.themeOption}>
                <button
                  type="button"
                  onClick={() => handleThemeChange(themeOption)}
                  className={`${styles.themeCard} ${theme === themeOption ? styles.active : ''}`}
                  aria-pressed={theme === themeOption}
                  aria-label={`Select ${themeOption} theme`}
                >
                  <div className={`${styles.themePreview} ${styles[themeOption]}`}>
                    <div className={styles.previewHeader}></div>
                    <div className={styles.previewContent}></div>
                  </div>
                  <span className={styles.themeName}>
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </span>
                  {theme === themeOption && (
                    <CheckIcon className={styles.checkIcon} aria-hidden="true" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Audio</h2>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label htmlFor="audio-toggle">Sound Effects</label>
              <p className={styles.settingDescription}>
                Enable audio feedback for interactions (cyber theme)
              </p>
            </div>
            <button
              id="audio-toggle"
              type="button"
              onClick={handleAudioToggle}
              className={`${styles.toggle} ${audioEnabled ? styles.enabled : styles.disabled}`}
              role="switch"
              aria-checked={audioEnabled}
              aria-label={`${audioEnabled ? 'Disable' : 'Enable'} sound effects`}
            >
              <span className={styles.toggleSlider}></span>
            </button>
          </div>
        </Card>

        {theme === 'cyber' && (
          <Card>
            <h2>Cyber Theme Options</h2>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <label htmlFor="scanline-toggle">Scanline Effects</label>
                <p className={styles.settingDescription}>
                  Authentic terminal scanline overlay
                </p>
              </div>
              <button
                id="scanline-toggle"
                type="button"
                onClick={handleScanlineToggle}
                className={`${styles.toggle} ${scanlineEnabled ? styles.enabled : styles.disabled}`}
                role="switch"
                aria-checked={scanlineEnabled}
                aria-label={`${scanlineEnabled ? 'Disable' : 'Enable'} scanline effects`}
              >
                <span className={styles.toggleSlider}></span>
              </button>
            </div>

            {scanlineEnabled && (
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <label htmlFor="scanline-frequency">Scanline Frequency</label>
                  <p className={styles.settingDescription}>
                    How often scanlines appear (lower = more frequent)
                  </p>
                </div>
                <select
                  id="scanline-frequency"
                  value={scanlineFrequency}
                  onChange={(e) => handleScanlineFrequencyChange(e.target.value)}
                  className={styles.select}
                  aria-label="Select scanline frequency"
                >
                  <option value="30">High (30s)</option>
                  <option value="90">Medium (90s)</option>
                  <option value="300">Low (300s)</option>
                </select>
              </div>
            )}
          </Card>
        )}

        <div className={styles.actions}>
          <button 
            onClick={handleSave}
            className={styles.saveButton}
            type="button"
            aria-label="Save appearance settings"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}