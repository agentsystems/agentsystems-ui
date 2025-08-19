/**
 * Enhanced error message component with accessibility and standardized error handling
 */

import { useEffect } from 'react'
import { AppError, ErrorType, getUserFriendlyMessage } from '@utils/errorHandling'
import { XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

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
  const iconStyle = { width: '1.5rem', height: '1.5rem', marginRight: '0.75rem', flexShrink: 0 }
  
  switch (errorType) {
    case ErrorType.VALIDATION:
      return <InformationCircleIcon style={{ ...iconStyle, color: 'var(--warning)' }} aria-hidden="true" />
    case ErrorType.NETWORK:
    case ErrorType.SERVER_ERROR:
      return <ExclamationTriangleIcon style={{ ...iconStyle, color: 'var(--error)' }} aria-hidden="true" />
    default:
      return <XCircleIcon style={{ ...iconStyle, color: 'var(--error)' }} aria-hidden="true" />
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
  // Handle legacy message prop or new error object
  const displayError: AppError | null = error 
    ? typeof error === 'string' 
      ? { type: ErrorType.UNKNOWN, message: error }
      : error
    : message
      ? { type: ErrorType.UNKNOWN, message }
      : null

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
        style={{
          padding: '1rem',
          background: isValidationError ? 'var(--warning-bg)' : 'var(--error-bg)',
          border: `1px solid ${isValidationError ? 'var(--warning)' : 'var(--error)'}`,
          borderRadius: 'var(--radius)',
          margin: '1rem 0',
          display: 'flex',
          alignItems: 'flex-start',
        }}
        className={className}
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        {getErrorIcon(displayError.type)}
        
        <div style={{ flex: 1 }}>
          <h4 
            id="error-title" 
            style={{ 
              margin: '0 0 0.5rem 0',
              color: isValidationError ? 'var(--warning)' : 'var(--error)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
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
            style={{ 
              margin: '0',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              lineHeight: '1.4',
            }}
          >
            {userMessage}
          </p>
          
          {(showRetry && onRetry) && (
            <button 
              onClick={onRetry}
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              aria-label="Retry the failed operation"
            >
              Try Again
            </button>
          )}
          
          {showDetails && displayError.originalError && (
            <details style={{ marginTop: '0.75rem' }}>
              <summary 
                style={{ 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  userSelect: 'none',
                }}
              >
                Technical Details
              </summary>
              <pre 
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
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