import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  CpuChipIcon,
  RectangleStackIcon,
  BoltIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { useAudio } from '@hooks/useAudio'
import { useThemeStore } from '@stores/themeStore'
import { APP_NAME, ROUTES } from '@constants/app'
import { useVersions } from '@hooks/useVersions'
import styles from './Sidebar.module.css'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

const navigationSections: NavigationSection[] = [
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
      { name: 'Agent Ecosystem', href: '/ecosystem', icon: RectangleStackIcon, badge: 'BETA' },
      { name: 'Discover', href: '/discover', icon: GlobeAltIcon },
      { name: 'Configuration', href: ROUTES.CONFIGURATION, icon: WrenchScrewdriverIcon },
      { name: 'Logs', href: ROUTES.LOGS, icon: DocumentTextIcon },
      { name: 'Support', href: '/support', icon: QuestionMarkCircleIcon },
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
                data-tour={
                  item.name.toLowerCase() === 'agents' ? 'agents-nav' :
                  item.name.toLowerCase() === 'configuration' ? 'settings-nav' :
                  item.name.toLowerCase() === 'agent ecosystem' ? 'discovery-nav' :
                  item.name.toLowerCase() === 'support' ? 'support-nav' :
                  undefined
                }
              >
                <item.icon className={styles.navIcon} aria-hidden="true" />
                <span>{item.name}</span>
                {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
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