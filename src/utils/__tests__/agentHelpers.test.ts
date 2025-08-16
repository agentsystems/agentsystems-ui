import { describe, it, expect } from 'vitest'
import { getAgentImage, getStatusVariant, formatUptime, getAgentErrorMessage } from '../agentHelpers'

describe('Agent Helpers', () => {
  describe('getAgentImage', () => {
    it('returns correct image for known agents', () => {
      expect(getAgentImage('hello-world-agent'))
        .toBe('agentsystems/hello-world-agent:latest')
      
      expect(getAgentImage('agent-template'))
        .toBe('agentsystems/agent-template:latest')
      
      expect(getAgentImage('historical-events-jokes'))
        .toBe('private-repository-examples/historical-events-jokes:0.1.0')
    })

    it('handles partial name matches', () => {
      expect(getAgentImage('hello-world-agent-v2'))
        .toBe('agentsystems/hello-world-agent:latest')
      
      expect(getAgentImage('my-hello-world-custom'))
        .toBe('agentsystems/hello-world-agent:latest')
    })

    it('returns generic format for unknown agents', () => {
      expect(getAgentImage('unknown-agent'))
        .toBe('unknown-agent:latest')
      
      expect(getAgentImage('custom-ml-agent'))
        .toBe('custom-ml-agent:latest')
    })
  })

  describe('getStatusVariant', () => {
    it('maps agent states to CSS variants', () => {
      expect(getStatusVariant('running')).toBe('running')
      expect(getStatusVariant('stopped')).toBe('stopped')
      expect(getStatusVariant('not-created')).toBe('notcreated')
      expect(getStatusVariant('unknown')).toBe('notcreated') // fallback
    })
  })

  describe('formatUptime', () => {
    it('formats uptime correctly', () => {
      expect(formatUptime(30)).toBe('30s')
      expect(formatUptime(90)).toBe('1m')
      expect(formatUptime(3661)).toBe('1h')
      expect(formatUptime(90000)).toBe('1d')
    })

    it('rounds down to nearest unit', () => {
      expect(formatUptime(59)).toBe('59s')
      expect(formatUptime(119)).toBe('1m')
      expect(formatUptime(7199)).toBe('1h')
    })
  })

  describe('getAgentErrorMessage', () => {
    it('provides friendly error messages for common errors', () => {
      const notFoundError = new Error('404 Agent not found')
      expect(getAgentErrorMessage(notFoundError))
        .toBe('Agent not found. It may have been removed or is not running.')

      const timeoutError = new Error('Request timeout')
      expect(getAgentErrorMessage(timeoutError))
        .toBe('Agent took too long to respond. It may be overloaded.')

      const networkError = new Error('Network connection failed')
      expect(getAgentErrorMessage(networkError))
        .toBe('Network error. Check your connection to the gateway.')
    })

    it('handles unknown errors gracefully', () => {
      expect(getAgentErrorMessage('unknown error'))
        .toBe('An unexpected error occurred')
      
      expect(getAgentErrorMessage(null))
        .toBe('An unexpected error occurred')
    })

    it('returns error message for Error objects', () => {
      const customError = new Error('Custom error message')
      expect(getAgentErrorMessage(customError))
        .toBe('Custom error message')
    })
  })
})