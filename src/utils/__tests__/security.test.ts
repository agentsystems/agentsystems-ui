import { describe, it, expect, beforeEach } from 'vitest'
import { 
  sanitizeHtml, 
  sanitizeText, 
  sanitizeUrl, 
  sanitizeJsonString, 
  sanitizeToken,
  rateLimiter 
} from '../security'

describe('Security Utilities', () => {
  describe('sanitizeHtml', () => {
    it('removes script tags', () => {
      const malicious = '<script>alert("xss")</script>Hello'
      expect(sanitizeHtml(malicious)).toBe('Hello')
    })

    it('removes javascript: links', () => {
      const malicious = '<a href="javascript:alert(\'xss\')">Click</a>'
      const result = sanitizeHtml(malicious)
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })

    it('removes event handlers', () => {
      const malicious = '<div onclick="alert(\'xss\')">Content</div>'
      const result = sanitizeHtml(malicious)
      expect(result).not.toContain('onclick')
      expect(result).toContain('Content')
    })

    it('handles non-string input gracefully', () => {
      expect(sanitizeHtml(null as any)).toBe('')
      expect(sanitizeHtml(undefined as any)).toBe('')
      expect(sanitizeHtml(123 as any)).toBe('')
    })
  })

  describe('sanitizeText', () => {
    it('removes control characters', () => {
      const input = 'Hello\x00\x08World\x1F'
      expect(sanitizeText(input)).toBe('HelloWorld')
    })

    it('normalizes unicode and trims whitespace', () => {
      const input = '  Hello\u0301  '
      const result = sanitizeText(input)
      expect(result).toBe('Helló') // Fix expected result
      expect(result.startsWith(' ')).toBe(false)
      expect(result.endsWith(' ')).toBe(false)
    })

    it('handles non-string input', () => {
      expect(sanitizeText(null as any)).toBe('')
      expect(sanitizeText({} as any)).toBe('')
    })
  })

  describe('sanitizeUrl', () => {
    it('allows valid HTTP/HTTPS URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
      expect(sanitizeUrl('https://api.example.com/v1')).toBe('https://api.example.com/v1')
    })

    it('blocks dangerous protocols', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('')
      expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('')
      expect(sanitizeUrl('ftp://example.com')).toBe('')
    })

    it('allows relative URLs', () => {
      expect(sanitizeUrl('/api/agents')).toBe('/api/agents')
      expect(sanitizeUrl('/dashboard')).toBe('/dashboard')
    })

    it('handles invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBe('')
      expect(sanitizeUrl('')).toBe('')
      expect(sanitizeUrl('http://')).toBe('')
    })
  })

  describe('sanitizeJsonString', () => {
    it('sanitizes string values in JSON objects', () => {
      const malicious = '{"name": "test\x00user", "content": "Hello World"}'
      const result = sanitizeJsonString(malicious)
      const parsed = JSON.parse(result)
      
      expect(parsed.name).toBe('testuser') // Control characters removed
      expect(parsed.content).toBe('Hello World') // Safe content preserved
    })

    it('handles nested objects and arrays', () => {
      const input = '{"users": [{"name": "test\x00user"}], "config": {"url": "test\x08url"}}'
      const result = sanitizeJsonString(input)
      const parsed = JSON.parse(result)
      
      expect(parsed.users[0].name).toBe('testuser')
      expect(parsed.config.url).toBe('testurl')
    })

    it('returns empty object for invalid JSON', () => {
      expect(sanitizeJsonString('invalid json')).toBe('{}')
      expect(sanitizeJsonString('')).toBe('{}')
      expect(sanitizeJsonString(null as any)).toBe('{}')
    })
  })

  describe('sanitizeToken', () => {
    it('removes dangerous characters from tokens', () => {
      expect(sanitizeToken('valid-token_123.abc')).toBe('valid-token_123.abc')
      expect(sanitizeToken('token<script>alert("xss")</script>')).toBe('tokenscriptalertxssscript')
      expect(sanitizeToken('token with spaces')).toBe('tokenwithspaces')
    })

    it('handles non-string input', () => {
      expect(sanitizeToken(null as any)).toBe('')
      expect(sanitizeToken(undefined as any)).toBe('')
    })
  })

  describe('rateLimiter', () => {
    beforeEach(() => {
      rateLimiter.clear('test-action')
    })

    it('allows calls within rate limit', () => {
      expect(rateLimiter.isAllowed('test-action', 3, 1000)).toBe(true)
      expect(rateLimiter.isAllowed('test-action', 3, 1000)).toBe(true)
      expect(rateLimiter.isAllowed('test-action', 3, 1000)).toBe(true)
    })

    it('blocks calls exceeding rate limit', () => {
      // Use up the limit
      for (let i = 0; i < 3; i++) {
        expect(rateLimiter.isAllowed('test-action', 3, 1000)).toBe(true)
      }
      
      // Next call should be blocked
      expect(rateLimiter.isAllowed('test-action', 3, 1000)).toBe(false)
    })

    it('resets after time window', () => {
      // Use up the limit with a very short window
      for (let i = 0; i < 2; i++) {
        expect(rateLimiter.isAllowed('test-action', 2, 1)).toBe(true)
      }
      
      // Should be blocked immediately
      expect(rateLimiter.isAllowed('test-action', 2, 1)).toBe(false)
      
      // Wait for window to expire (1ms) and try again
      setTimeout(() => {
        expect(rateLimiter.isAllowed('test-action', 2, 1)).toBe(true)
      }, 2)
    })

    it('handles different keys independently', () => {
      // Use up limit for one key
      for (let i = 0; i < 3; i++) {
        expect(rateLimiter.isAllowed('action-1', 3, 1000)).toBe(true)
      }
      expect(rateLimiter.isAllowed('action-1', 3, 1000)).toBe(false)
      
      // Different key should still work
      expect(rateLimiter.isAllowed('action-2', 3, 1000)).toBe(true)
    })
  })
})