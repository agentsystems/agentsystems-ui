import { useAuthStore } from '@stores/authStore'
import styles from './Header.module.css'

export default function Header() {
  const { gatewayUrl } = useAuthStore()

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Mission Control</h1>
      
      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>Connected</span>
          <span className={styles.statusUrl}>{gatewayUrl}</span>
        </div>
      </div>
    </header>
  )
}