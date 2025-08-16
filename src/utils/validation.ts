/**
 * Form validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validate URL format
 */
export const validateUrl = (url: string): string | null => {
  if (!url.trim()) {
    return 'URL is required'
  }
  
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must use http:// or https://'
    }
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

/**
 * Validate auth token format
 */
export const validateToken = (token: string): string | null => {
  if (!token.trim()) {
    return 'Auth token is required'
  }
  
  if (token.length < 3) {
    return 'Auth token must be at least 3 characters'
  }
  
  return null
}

/**
 * Validate JSON payload
 */
export const validateJson = (jsonString: string): string | null => {
  if (!jsonString.trim()) {
    return 'JSON payload is required'
  }
  
  try {
    JSON.parse(jsonString)
    return null
  } catch {
    return 'Please enter valid JSON'
  }
}

/**
 * Validate settings form
 */
export const validateSettings = (gatewayUrl: string, token: string): ValidationResult => {
  const errors: Record<string, string> = {}
  
  const urlError = validateUrl(gatewayUrl)
  if (urlError) {
    errors.gatewayUrl = urlError
  }
  
  const tokenError = validateToken(token)
  if (tokenError) {
    errors.token = tokenError
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate agent invocation form
 */
export const validateInvocation = (agentName: string, payload: string): ValidationResult => {
  const errors: Record<string, string> = {}
  
  if (!agentName?.trim()) {
    errors.agentName = 'Agent name is required'
  }
  
  const jsonError = validateJson(payload)
  if (jsonError) {
    errors.payload = jsonError
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}