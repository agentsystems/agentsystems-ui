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
import { Link } from 'react-router-dom'
import { CheckIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '@stores/themeStore'
import type { Theme, ScanlineFrequency } from '@types/common'
import { isAudioEnabled, setAudioEnabled } from '@utils/audioFx'
import { useAudio } from '@hooks/useAudio'
import Card from '@components/common/Card'
import styles from './AppearancePage.module.css'

export default function AppearancePage() {
  const { theme, scanlineEnabled, scanlineFrequency, setTheme, setScanlineEnabled, setScanlineFrequency } = useThemeStore()
  const { playClickSound } = useAudio()
  const [audioEnabled, setAudioEnabledState] = useState(isAudioEnabled())

  const handleThemeChange = (newTheme: string) => {
    playClickSound()
    setTheme(newTheme as Theme)
  }

  const handleScanlineToggle = () => {
    playClickSound()
    setScanlineEnabled(!scanlineEnabled)
  }

  const handleScanlineFrequencyChange = (frequency: string) => {
    playClickSound()
    setScanlineFrequency(frequency as ScanlineFrequency)
  }

  const handleAudioToggle = () => {
    playClickSound()
    const newValue = !audioEnabled
    setAudioEnabledState(newValue)
    setAudioEnabled(newValue) // Save immediately
  }

  return (
    <div className={styles.appearancePage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Appearance</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Appearance</h1>
          <p>Customize the visual theme and audio preferences</p>
        </div>
      </div>

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

        {theme === 'cyber' && (
          <Card className={styles.cyberCard}>
            <h2>Cyber Theme Options</h2>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <label htmlFor="audio-toggle">Sound Effects</label>
                <p className={styles.settingDescription}>
                  Enable audio feedback for interactions
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
    </div>
  )
}