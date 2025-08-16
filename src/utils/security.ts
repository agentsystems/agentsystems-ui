/**
 * Security utilities for input sanitization and validation
 * Protects against XSS attacks and other security vulnerabilities
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous HTML tags and attributes
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  return input
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: links
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove data: URLs that could contain scripts
    .replace(/data:\s*text\/html/gi, 'data:text/plain')
    // Remove dangerous protocols
    .replace(/(src|href)\s*=\s*["']\s*(javascript|vbscript|data:text\/html)/gi, '$1=""')
    // Trim whitespace
    .trim()
}

/**
 * Sanitize plain text input
 * Removes control characters and normalizes whitespace
 */
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  return input
    // Remove control characters except tab, newline, carriage return
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Unicode
    .normalize('NFC')
    // Trim whitespace
    .trim()
}

/**
 * Sanitize URL input to prevent malicious URLs
 * Only allows http, https, and relative URLs
 */
export const sanitizeUrl = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  const trimmed = sanitizeText(input)
  if (!trimmed) return ''
  
  // Allow relative URLs (starting with /)
  if (trimmed.startsWith('/')) {
    return trimmed
  }
  
  try {
    const url = new URL(trimmed)
    
    // Only allow safe protocols
    if (['http:', 'https:'].includes(url.protocol)) {
      return url.toString()
    }
    
    // Reject dangerous protocols
    return ''
  } catch {
    // Invalid URL format
    return ''
  }
}

/**
 * Sanitize JSON input safely
 * Validates JSON structure and sanitizes string values
 */
export const sanitizeJsonString = (input: string): string => {
  if (typeof input !== 'string') return '{}'
  
  const sanitized = sanitizeText(input)
  if (!sanitized) return '{}'
  
  try {
    // Parse to validate JSON structure
    const parsed = JSON.parse(sanitized)
    
    // Recursively sanitize string values in the object
    const sanitizeObject = (obj: unknown): unknown => {
      if (typeof obj === 'string') {
        return sanitizeText(obj)
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject)
      } else if (obj && typeof obj === 'object') {
        const sanitizedObj: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
          const sanitizedKey = sanitizeText(key)
          if (sanitizedKey) {
            sanitizedObj[sanitizedKey] = sanitizeObject(value)
          }
        }
        return sanitizedObj
      }
      return obj
    }
    
    const sanitizedParsed = sanitizeObject(parsed)
    return JSON.stringify(sanitizedParsed, null, 2)
  } catch {
    // Invalid JSON - return empty object
    return '{}'
  }
}

/**
 * Sanitize auth token input
 * Removes dangerous characters while preserving valid token characters
 */
export const sanitizeToken = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  return input
    // Allow alphanumeric, hyphens, underscores, and dots (common in tokens)
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .trim()
}

/**
 * Rate limiting for API calls to prevent abuse
 */
class RateLimiter {
  private calls: Map<string, number[]> = new Map()
  
  /**
   * Check if an action is allowed based on rate limits
   * @param key - Identifier for the action (e.g., 'api-call', 'form-submit')
   * @param maxCalls - Maximum calls allowed in the time window
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxCalls: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const calls = this.calls.get(key) || []
    
    // Remove old calls outside the window
    const recentCalls = calls.filter(time => now - time < windowMs)
    
    if (recentCalls.length >= maxCalls) {
      return false
    }
    
    // Add current call
    recentCalls.push(now)
    this.calls.set(key, recentCalls)
    
    return true
  }
  
  /**
   * Clear rate limit history for a key
   */
  clear(key: string): void {
    this.calls.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Security headers for API requests
 */
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
}