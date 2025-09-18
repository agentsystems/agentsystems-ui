import { ReactNode, KeyboardEvent, forwardRef } from 'react'
import clsx from 'clsx'
import { useAudio } from '@hooks/useAudio'
import styles from './Card.module.css'

interface CardProps {
  /** Content to display inside the card */
  children: ReactNode
  /** Additional CSS classes to apply */
  className?: string
  /** Visual variant of the card */
  variant?: 'default' | 'bordered' | 'elevated'
  /** Callback when card is clicked - makes card interactive */
  onClick?: () => void
  /** Accessible label for screen readers when card is interactive */
  ariaLabel?: string
  /** Description for assistive technology */
  ariaDescription?: string
  /** Whether this card represents a selected/active state */
  isSelected?: boolean
  /** ARIA role for the card */
  role?: string
  /** Tab index for keyboard navigation */
  tabIndex?: number
  /** Tour data attribute */
  'data-tour'?: string
}

/**
 * Reusable card component with consistent styling and theme support
 * 
 * Features:
 * - Three visual variants (default, bordered, elevated)
 * - Interactive mode with click handling and audio feedback
 * - Gradient accent border on all cards
 * - Hover effects for clickable cards
 * - Theme-aware styling across dark, light, and cyber themes
 * 
 * @example
 * ```tsx
 * // Display card
 * <Card variant="elevated">
 *   <h3>Agent Status</h3>
 *   <p>All systems operational</p>
 * </Card>
 * 
 * // Interactive card
 * <Card onClick={() => navigate('/agent')} variant="bordered">
 *   <h3>hello-world-agent</h3>
 *   <p>Click to view details</p>
 * </Card>
 * ```
 */
const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className, 
  variant = 'default',
  onClick,
  ariaLabel,
  ariaDescription,
  isSelected,
  role,
  tabIndex,
  'data-tour': dataTour
}, ref) => {
  const { playClickSound } = useAudio()

  const handleClick = () => {
    playClickSound()
    onClick?.()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      handleClick()
    }
  }

  const isInteractive = !!onClick

  return (
    <div 
      ref={ref}
      className={clsx(
        styles.card,
        styles[variant],
        isInteractive && styles.clickable,
        className
      )}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      tabIndex={tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : undefined)}
      role={role || (isInteractive ? 'button' : 'region')}
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      aria-pressed={isSelected}
      data-tour={dataTour}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card