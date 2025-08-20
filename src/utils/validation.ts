/**
 * Form validation utilities with comprehensive input limits and security checks
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Input length limits for security and UX
export const INPUT_LIMITS = {
  URL_MAX_LENGTH: 2048,
  TOKEN_MAX_LENGTH: 512,
  TOKEN_MIN_LENGTH: 8,
  AGENT_NAME_MAX_LENGTH: 64,
  JSON_PAYLOAD_MAX_LENGTH: 1024 * 1024, // 1MB
  GENERAL_TEXT_MAX_LENGTH: 1000,
  USERNAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254, // RFC 5321 limit
} as const

// Regex patterns for validation
const PATTERNS = {
  AGENT_NAME: /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  SAFE_TEXT: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
} as const

/**
 * Validate URL format with length and security checks
 */
export const validateUrl = (url: string): string | null => {
  const trimmedUrl = url.trim()
  
  if (!trimmedUrl) {
    return 'URL is required'
  }
  
  if (trimmedUrl.length > INPUT_LIMITS.URL_MAX_LENGTH) {
    return `URL must be less than ${INPUT_LIMITS.URL_MAX_LENGTH} characters`
  }
  
  // Check for suspicious patterns
  if (trimmedUrl.includes('javascript:') || trimmedUrl.includes('data:')) {
    return 'Invalid URL protocol'
  }
  
  try {
    const urlObj = new URL(trimmedUrl)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must use http:// or https://'
    }
    
    // Additional security: check for suspicious hosts
    const suspiciousPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
    const isLocalhost = suspiciousPatterns.some(pattern => urlObj.hostname.includes(pattern))
    
    if (isLocalhost && import.meta.env.PROD) {
      return 'Localhost URLs not allowed in production'
    }
    
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

/**
 * Validate auth token format with enhanced security checks
 */
export const validateToken = (token: string): string | null => {
  const trimmedToken = token.trim()
  
  if (!trimmedToken) {
    return 'Auth token is required'
  }
  
  if (trimmedToken.length < INPUT_LIMITS.TOKEN_MIN_LENGTH) {
    return `Auth token must be at least ${INPUT_LIMITS.TOKEN_MIN_LENGTH} characters`
  }
  
  if (trimmedToken.length > INPUT_LIMITS.TOKEN_MAX_LENGTH) {
    return `Auth token must be less than ${INPUT_LIMITS.TOKEN_MAX_LENGTH} characters`
  }
  
  // Check for suspicious patterns
  if (trimmedToken.includes(' ') || trimmedToken.includes('\n') || trimmedToken.includes('\t')) {
    return 'Auth token cannot contain whitespace characters'
  }
  
  // Basic format validation - tokens should be alphanumeric with some special chars
  if (!/^[a-zA-Z0-9\-_.]+$/.test(trimmedToken)) {
    return 'Auth token contains invalid characters'
  }
  
  return null
}

/**
 * Validate JSON payload with size limits and security checks
 */
export const validateJson = (jsonString: string): string | null => {
  const trimmedJson = jsonString.trim()
  
  if (!trimmedJson) {
    return 'JSON payload is required'
  }
  
  if (trimmedJson.length > INPUT_LIMITS.JSON_PAYLOAD_MAX_LENGTH) {
    return `JSON payload must be less than ${Math.round(INPUT_LIMITS.JSON_PAYLOAD_MAX_LENGTH / 1024)}KB`
  }
  
  try {
    const parsed = JSON.parse(trimmedJson)
    
    // Security: Prevent deeply nested objects that could cause DoS
    const maxDepth = 10
    function checkDepth(obj: any, depth = 0): boolean {
      if (depth > maxDepth) return false
      if (obj && typeof obj === 'object') {
        return Object.values(obj).every(value => checkDepth(value, depth + 1))
      }
      return true
    }
    
    if (!checkDepth(parsed)) {
      return 'JSON payload is too deeply nested (max 10 levels)'
    }
    
    // Security: Limit array sizes
    function checkArraySizes(obj: any): boolean {
      if (Array.isArray(obj)) {
        if (obj.length > 1000) return false
        return obj.every(item => checkArraySizes(item))
      }
      if (obj && typeof obj === 'object') {
        return Object.values(obj).every(value => checkArraySizes(value))
      }
      return true
    }
    
    if (!checkArraySizes(parsed)) {
      return 'JSON payload contains arrays that are too large (max 1000 items)'
    }
    
    return null
  } catch (error) {
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
 * Validate agent name with enhanced checks
 */
export const validateAgentName = (agentName: string): string | null => {
  const trimmedName = agentName.trim()
  
  if (!trimmedName) {
    return 'Agent name is required'
  }
  
  if (trimmedName.length > INPUT_LIMITS.AGENT_NAME_MAX_LENGTH) {
    return `Agent name must be less than ${INPUT_LIMITS.AGENT_NAME_MAX_LENGTH} characters`
  }
  
  if (!PATTERNS.AGENT_NAME.test(trimmedName)) {
    return 'Agent name can only contain letters, numbers, hyphens, and underscores'
  }
  
  return null
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): string | null => {
  const trimmedEmail = email.trim()
  
  if (!trimmedEmail) {
    return 'Email is required'
  }
  
  if (trimmedEmail.length > INPUT_LIMITS.EMAIL_MAX_LENGTH) {
    return `Email must be less than ${INPUT_LIMITS.EMAIL_MAX_LENGTH} characters`
  }
  
  if (!PATTERNS.EMAIL.test(trimmedEmail)) {
    return 'Please enter a valid email address'
  }
  
  return null
}

/**
 * Validate general text input with length limits
 */
export const validateText = (
  text: string, 
  fieldName: string = 'Field',
  maxLength: number = INPUT_LIMITS.GENERAL_TEXT_MAX_LENGTH,
  required: boolean = true
): string | null => {
  const trimmedText = text.trim()
  
  if (required && !trimmedText) {
    return `${fieldName} is required`
  }
  
  if (trimmedText.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`
  }
  
  return null
}

/**
 * Validate agent invocation form with enhanced validation
 */
export const validateInvocation = (agentName: string, payload: string): ValidationResult => {
  const errors: Record<string, string> = {}
  
  const agentError = validateAgentName(agentName)
  if (agentError) {
    errors.agentName = agentError
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