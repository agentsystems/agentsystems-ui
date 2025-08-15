import { useThemeStore } from '@stores/themeStore'
import { useAuthStore } from '@stores/authStore'
import styles from './Header.module.css'

export default function Header() {
  const { theme, setTheme } = useThemeStore()
  const { gatewayUrl } = useAuthStore()

  const themes = [
    { value: 'dark', label: '🌙 Dark' },
    { value: 'light', label: '☀️ Light' },
    { value: 'cyber', label: '👾 Cyber' },
  ] as const

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Mission Control</h1>
      
      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>Connected</span>
          <span className={styles.statusUrl}>{gatewayUrl}</span>
        </div>
        
        <select
          className={styles.themeSelector}
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  )
}