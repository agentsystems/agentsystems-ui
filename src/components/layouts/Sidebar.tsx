import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  CpuChipIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline'
import styles from './Sidebar.module.css'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Agents', href: '/agents', icon: CpuChipIcon },
  { name: 'Logs', href: '/logs', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoGradient}>AS</div>
        <span className={styles.logoText}>AgentSystems</span>
        <div className={styles.logoBadge}>v0.1</div>
      </div>
      
      <nav className={styles.nav}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <item.icon className={styles.navIcon} aria-hidden="true" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.version}>v0.1.0</div>
      </div>
    </aside>
  )
}