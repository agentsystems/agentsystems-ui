import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import RestartBanner from '@components/common/RestartBanner'
import styles from './MainLayout.module.css'

/**
 * Main application layout component
 * 
 * Provides the overall structure with sidebar navigation, header,
 * and main content area. Includes proper semantic HTML and ARIA landmarks.
 */
export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <RestartBanner />
        <main className={styles.content} id="main-content" role="main" aria-label="Main content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}