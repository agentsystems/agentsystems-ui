import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  CpuChipIcon,
  BoltIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { useAudio } from '@hooks/useAudio'
import { useThemeStore } from '@stores/themeStore'
import { APP_NAME, ROUTES } from '@constants/app'
import { useVersions } from '@hooks/useVersions'
import styles from './Sidebar.module.css'

const navigationSections = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
      { name: 'Agents', href: ROUTES.AGENTS, icon: CpuChipIcon },
      { name: 'Executions', href: ROUTES.EXECUTIONS, icon: BoltIcon },
    ]
  },
  {
    title: 'Platform',
    items: [
      { name: 'Logs', href: ROUTES.LOGS, icon: DocumentTextIcon },
      { name: 'Configuration', href: ROUTES.CONFIGURATION, icon: WrenchScrewdriverIcon },
    ]
  }
]

export default function Sidebar() {
  const { playClickSound } = useAudio()
  const { theme } = useThemeStore()
  const { ui_version, gateway_version } = useVersions()

  return (
    <aside className={styles.sidebar} id="navigation" role="navigation" aria-label="Main navigation">
      <div className={styles.logo} role="banner">
        <img 
          src={theme === 'light' ? '/fitted-logo-light-bg.png' : '/fitted-logo-dark-bg.png'}
          alt={APP_NAME}
          className={styles.logoImage}
        />
      </div>
      
      <nav className={styles.nav} aria-label="Application sections">
        {navigationSections.map((section) => (
          <div key={section.title} className={styles.navSection} role="group" aria-labelledby={`nav-${section.title.toLowerCase()}`}>
            <div className={styles.navTitle} id={`nav-${section.title.toLowerCase()}`}>{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
                onClick={playClickSound}
                aria-label={`Navigate to ${item.name} page`}
              >
                <item.icon className={styles.navIcon} aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.version}>
          UI {ui_version} | ACP {gateway_version}
        </div>
      </div>
    </aside>
  )
}