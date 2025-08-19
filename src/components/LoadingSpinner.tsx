/**
 * Loading spinner component with consistent styling across themes
 * 
 * Features:
 * - Theme-aware styling
 * - Accessible loading announcement
 * - Consistent spinner animation
 * - Proper ARIA labeling for screen readers
 * 
 * @example
 * ```tsx
 * <Suspense fallback={<LoadingSpinner />}>
 *   <LazyComponent />
 * </Suspense>
 * ```
 */

import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  /** Custom message to display while loading */
  message?: string
  /** Custom className for additional styling */
  className?: string
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div 
      className={`${styles.loadingSpinner} ${className}`}
      role="status"
      aria-label={message}
    >
      <div 
        className={styles.spinner}
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  )
}