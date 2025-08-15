import { ReactNode } from 'react'
import clsx from 'clsx'
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
  return (
    <div 
      className={clsx(
        styles.card,
        styles[variant],
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}