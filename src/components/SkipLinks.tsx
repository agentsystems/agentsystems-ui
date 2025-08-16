import styles from './SkipLinks.module.css'

/**
 * Skip navigation links for screen reader and keyboard users
 * 
 * Allows users to quickly jump to main content areas without
 * tabbing through all navigation elements.
 */
export default function SkipLinks() {
  return (
    <div className={styles.skipLinks}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <a href="#navigation" className={styles.skipLink}>
        Skip to navigation
      </a>
    </div>
  )
}