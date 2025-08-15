import { ReactNode } from 'react'
import clsx from 'clsx'
import { useAudio } from '@hooks/useAudio'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'elevated'
  onClick?: () => void
}

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