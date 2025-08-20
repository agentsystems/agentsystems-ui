/**
 * Enhanced error message component with accessibility and standardized error handling
 */

import { useEffect, useMemo } from 'react'
import { AppError, ErrorType, getUserFriendlyMessage } from '@utils/errorHandling'
import { XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  /** Error object or simple message string */
  error?: AppError | string | null
  /** Legacy message prop for backward compatibility */
  message?: string
  /** Whether to show the retry button */
  showRetry?: boolean
  /** Callback when retry button is clicked */
  onRetry?: () => void
  /** Whether to show technical details (development only) */
  showDetails?: boolean
  /** Custom className for styling */
  className?: string
  /** Whether to announce the error to screen readers */
  announceToScreenReader?: boolean
}

/**
 * Get appropriate icon for error type
 */
function getErrorIcon(errorType: ErrorType) {
  switch (errorType) {
    case ErrorType.VALIDATION:
      return <InformationCircleIcon className={`${styles.icon} ${styles.iconWarning}`} aria-hidden="true" />
    case ErrorType.NETWORK:
    case ErrorType.SERVER_ERROR:
      return <ExclamationTriangleIcon className={`${styles.icon} ${styles.iconError}`} aria-hidden="true" />
    default:
      return <XCircleIcon className={`${styles.icon} ${styles.iconError}`} aria-hidden="true" />
  }
}

export default function ErrorMessage({
  error,
  message, // Legacy prop
  showRetry = false,
  onRetry,
  showDetails = import.meta.env.DEV,
  className = '',
  announceToScreenReader = true,
}: ErrorMessageProps) {
  // Handle legacy message prop or new error object - memoized to prevent unnecessary re-renders
  const displayError: AppError | null = useMemo(() => {
    return error 
      ? typeof error === 'string' 
        ? { type: ErrorType.UNKNOWN, message: error }
        : error
      : message
        ? { type: ErrorType.UNKNOWN, message }
        : null
  }, [error, message])

  // Announce errors to screen readers for accessibility
  useEffect(() => {
    if (displayError && announceToScreenReader) {
      const userMessage = getUserFriendlyMessage(displayError)
      
      // Use ARIA live region approach
      const liveRegion = document.getElementById('error-announcer')
      if (liveRegion) {
        liveRegion.textContent = `Error: ${userMessage}`
        // Clear after announcement
        setTimeout(() => {
          if (liveRegion) liveRegion.textContent = ''
        }, 1000)
      }
    }
  }, [displayError, announceToScreenReader])

  if (!displayError) {
    return null
  }

  const userMessage = getUserFriendlyMessage(displayError)
  const isValidationError = displayError.type === ErrorType.VALIDATION

  return (
    <>
      {/* Hidden live region for screen reader announcements */}
      <div 
        id="error-announcer" 
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
      />
      
      <div 
        className={`${styles.errorMessage} ${
          isValidationError ? styles.errorMessageValidation : styles.errorMessageDefault
        } ${className}`}
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        {getErrorIcon(displayError.type)}
        
        <div className={styles.content}>
          <h4 
            id="error-title" 
            className={`${styles.title} ${
              isValidationError ? styles.titleWarning : styles.titleError
            }`}
          >
            {isValidationError ? 'Input Error' :
             displayError.type === ErrorType.NETWORK ? 'Connection Error' :
             displayError.type === ErrorType.AUTHENTICATION ? 'Authentication Error' :
             displayError.type === ErrorType.AUTHORIZATION ? 'Access Denied' :
             displayError.type === ErrorType.NOT_FOUND ? 'Not Found' :
             displayError.type === ErrorType.SERVER_ERROR ? 'Server Error' :
             'Error'}
          </h4>
          
          <p 
            id="error-description" 
            className={styles.description}
          >
            {userMessage}
          </p>
          
          {(showRetry && onRetry) && (
            <button 
              onClick={onRetry}
              className={styles.retryButton}
              aria-label="Retry the failed operation"
            >
              Try Again
            </button>
          )}
          
          {showDetails && displayError.originalError && (
            <details className={styles.details}>
              <summary className={styles.detailsSummary}>
                Technical Details
              </summary>
              <pre className={styles.technicalDetails}>
                {displayError.originalError.message}
                {displayError.originalError.stack && `\n\nStack:\n${displayError.originalError.stack.split('\n').slice(0, 5).join('\n')}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </>
  )
}