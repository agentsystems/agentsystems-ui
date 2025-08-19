/**
 * Sentry configuration for production error tracking and performance monitoring
 * 
 * Features:
 * - Error tracking with user context
 * - Performance monitoring
 * - Release tracking
 * - Environment-based configuration
 * - Privacy-focused data filtering
 */

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// Environment configuration
const isProduction = import.meta.env.PROD
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
const environment = import.meta.env.VITE_ENVIRONMENT || (isProduction ? 'production' : 'development')
const release = import.meta.env.VITE_APP_VERSION || '0.1.0'

/**
 * Initialize Sentry error tracking and performance monitoring
 * Only initializes in production or when VITE_SENTRY_DSN is provided
 */
export function initSentry() {
  // Only initialize Sentry if DSN is provided and not in test environment
  if (!sentryDsn || import.meta.env.MODE === 'test') {
    console.log('Sentry disabled: No DSN provided or running in test mode')
    return
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    release: `agentsystems-ui@${release}`,
    
    // Performance monitoring
    integrations: [
      new BrowserTracing({
        // Set tracing origin patterns to track internal API calls
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/api\.agentsystems\./,
          /^\/api/,
        ],
      }),
    ],
    
    // Performance monitoring sample rate
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    
    // Error sampling (100% in production for comprehensive error tracking)
    sampleRate: 1.0,
    
    // Privacy and security settings
    beforeSend(event, hint) {
      // Filter out sensitive information
      if (event.request?.headers) {
        // Remove authorization headers
        delete event.request.headers['Authorization']
        delete event.request.headers['authorization']
      }
      
      // Filter out specific error types that are not actionable
      if (hint.originalException instanceof Error) {
        const message = hint.originalException.message
        
        // Filter out network errors from ad blockers or extensions
        if (message.includes('Script error') || 
            message.includes('Non-Error promise rejection captured') ||
            message.includes('Network Error')) {
          return null
        }
      }
      
      return event
    },
    
    // Configure which URLs to ignore for error tracking
    ignoreErrors: [
      // Browser extension errors
      'Non-Error promise rejection captured',
      'Script error.',
      'Network Error',
      
      // Common harmless errors
      'ResizeObserver loop limit exceeded',
      'ChunkLoadError',
      
      // Ad blocker related
      'AbortError: Fetch was aborted',
    ],
    
    // Configure which URLs to ignore for performance tracking
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      
      // Ad blockers and tracking scripts
      /googletagmanager/i,
      /google-analytics/i,
      /facebook/i,
    ],
    
    // Debug mode in development
    debug: !isProduction,
    
    // Additional context
    initialScope: {
      tags: {
        component: 'agentsystems-ui',
      },
    },
  })

  console.log(`Sentry initialized for ${environment} environment`)
}

/**
 * Set user context for error tracking
 * @param user User information to associate with errors
 */
export function setSentryUser(user: {
  id?: string
  email?: string
  username?: string
  [key: string]: unknown
}) {
  Sentry.setUser(user)
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null)
}

/**
 * Add custom context to error reports
 * @param key Context key
 * @param value Context value
 */
export function setSentryContext(key: string, value: Record<string, unknown>) {
  Sentry.setContext(key, value)
}

/**
 * Add breadcrumb for debugging
 * @param message Breadcrumb message
 * @param category Category (e.g., 'ui', 'api', 'navigation')
 * @param level Severity level
 */
export function addSentryBreadcrumb(
  message: string,
  category: string = 'ui',
  level: 'info' | 'warning' | 'error' | 'debug' = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Manually capture an exception
 * @param error Error to capture
 * @param context Additional context
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
      Sentry.captureException(error)
    })
  } else {
    Sentry.captureException(error)
  }
}

/**
 * Manually capture a message
 * @param message Message to capture
 * @param level Severity level
 * @param context Additional context
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' | 'debug' = 'info',
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
      Sentry.captureMessage(message, level)
    })
  } else {
    Sentry.captureMessage(message, level)
  }
}

// Export Sentry for direct access if needed
export { Sentry }