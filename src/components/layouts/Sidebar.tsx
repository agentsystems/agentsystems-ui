import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  CpuChipIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline'
import { useAudio } from '@hooks/useAudio'
import { APP_VERSION, APP_NAME, ROUTES } from '@constants/app'
import styles from './Sidebar.module.css'

const navigationSections = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
      { name: 'Agents', href: ROUTES.AGENTS, icon: CpuChipIcon },
    ]
  },
  {
    title: 'Platform',
    items: [
      { name: 'Logs', href: ROUTES.LOGS, icon: DocumentTextIcon },
      { name: 'Settings', href: ROUTES.SETTINGS, icon: Cog6ToothIcon },
    ]
  }
]

export default function Sidebar() {
  const { playClickSound } = useAudio()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoGradient}>AS</div>
        <span className={styles.logoText}>{APP_NAME}</span>
        <div className={styles.logoBadge}>{APP_VERSION}</div>
      </div>
      
      <nav className={styles.nav}>
        {navigationSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <div className={styles.navTitle}>{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
                onClick={playClickSound}
              >
                <item.icon className={styles.navIcon} aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.version}>{APP_VERSION}</div>
      </div>
    </aside>
  )
}