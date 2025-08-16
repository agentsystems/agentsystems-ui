import { ReactNode } from 'react'
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
export default function Card({ 
  children, 
  className, 
  variant = 'default',
  onClick 
}: CardProps) {
  const { playClickSound } = useAudio()

  const handleClick = () => {
    playClickSound()
    onClick?.()
  }

  return (
    <div 
      className={clsx(
        styles.card,
        styles[variant],
        onClick && styles.clickable,
        className
      )}
      onClick={onClick ? handleClick : undefined}
    >
      {children}
    </div>
  )
}