/**
 * Standardized error handling utilities for consistent error management across the application
 */

import { AxiosError } from 'axios'
import { captureException, addSentryBreadcrumb } from '@config/sentry'

// Standard error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType
  message: string
  originalError?: Error
  code?: string | number
  context?: Record<string, unknown>
}

/**
 * Parse and categorize errors from various sources
 */
export function parseError(error: unknown, context?: Record<string, unknown>): AppError {
  // Axios errors (API calls)
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    switch (status) {
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Authentication failed. Please check your credentials.',
          originalError: error,
          code: status,
          context,
        }
      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'Access denied. You do not have permission to perform this action.',
          originalError: error,
          code: status,
          context,
        }
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: 'The requested resource was not found.',
          originalError: error,
          code: status,
          context,
        }
      case 422:
        return {
          type: ErrorType.VALIDATION,
          message: error.response?.data?.detail || 'Invalid input provided.',
          originalError: error,
          code: status,
          context,
        }
      case 429:
        return {
          type: ErrorType.NETWORK,
          message: 'Too many requests. Please wait a moment and try again.',
          originalError: error,
          code: status,
          context,
        }
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER_ERROR,
          message: 'Server error occurred. Please try again later.',
          originalError: error,
          code: status,
          context,
        }
      default:
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          return {
            type: ErrorType.NETWORK,
            message: 'Network connection failed. Please check your internet connection.',
            originalError: error,
            context,
          }
        }
        return {
          type: ErrorType.UNKNOWN,
          message: message || 'An unexpected error occurred.',
          originalError: error,
          code: status,
          context,
        }
    }
  }
  
  // Standard JavaScript errors
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred.',
      originalError: error,
      context,
    }
  }
  
  // String errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
      context,
    }
  }
  
  // Unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred.',
    context: { ...context, rawError: error },
  }
}

/**
 * Handle errors consistently across the application
 */
export function handleError(
  error: unknown,
  context?: {
    component?: string
    action?: string
    userId?: string
    additionalContext?: Record<string, unknown>
  }
): AppError {
  const parsedError = parseError(error, context?.additionalContext)
  
  // Add breadcrumb for debugging
  addSentryBreadcrumb(
    `Error in ${context?.component || 'unknown'}: ${parsedError.message}`,
    'error'
  )
  
  // Capture in error tracking (but not validation errors)
  if (parsedError.type !== ErrorType.VALIDATION && parsedError.originalError) {
    captureException(parsedError.originalError, {
      component: context?.component,
      action: context?.action,
      errorType: parsedError.type,
      ...context?.additionalContext,
    })
  }
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ErrorHandler]', {
      component: context?.component,
      action: context?.action,
      error: parsedError,
      originalError: error,
    })
  }
  
  return parsedError
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Connection failed. Please check your internet connection and try again.'
    case ErrorType.AUTHENTICATION:
      return 'Please log in again. Your session may have expired.'
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.'
    case ErrorType.NOT_FOUND:
      return 'The requested item could not be found.'
    case ErrorType.VALIDATION:
      return error.message // Validation messages are already user-friendly
    case ErrorType.SERVER_ERROR:
      return 'Server error occurred. Please try again in a few moments.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

/**
 * Check if an error should be retried automatically
 */
export function shouldRetry(error: AppError): boolean {
  return error.type === ErrorType.NETWORK || 
         (error.type === ErrorType.SERVER_ERROR && [502, 503, 504].includes(error.code as number))
}

/**
 * Get retry delay in milliseconds (exponential backoff)
 */
export function getRetryDelay(attemptNumber: number): number {
  return Math.min(1000 * Math.pow(2, attemptNumber), 30000) // Cap at 30 seconds
}

/**
 * React hook for consistent error handling in components
 */
export function useErrorHandler(componentName: string) {
  return (error: unknown, action?: string, additionalContext?: Record<string, unknown>) => {
    return handleError(error, {
      component: componentName,
      action,
      additionalContext,
    })
  }
}