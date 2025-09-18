/**
 * Unified system status banner component for consistent status display
 * 
 * Features:
 * - Status-colored background and accent border
 * - Icon display based on status type
 * - Flexible title and message display
 * - Theme-aware styling
 * - Accessibility support
 */

import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import styles from './SystemStatusBanner.module.css'

type StatusType = 'healthy' | 'warning' | 'error'

interface SystemStatusBannerProps {
  /** Status level - determines color and icon */
  status: StatusType
  /** Main status title */
  title: string
  /** Descriptive message */
  message: string
  /** Additional CSS classes */
  className?: string
  /** Tour data attribute */
  'data-tour'?: string
}

export default function SystemStatusBanner({
  status,
  title,
  message,
  className = '',
  'data-tour': dataTour
}: SystemStatusBannerProps) {
  const StatusIcon = {
    healthy: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon
  }[status]

  return (
    <div className={`${styles.statusBanner} ${styles[status]} ${className}`} data-tour={dataTour}>
      <div className={styles.statusContent}>
        <div className={styles.statusInfo}>
          <StatusIcon className={styles.statusIcon} />
          <div>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}