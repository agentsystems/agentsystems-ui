/**
 * Utility functions for agent-related operations
 */

/**
 * Generate agent image/repository information based on agent name
 */
export const getAgentImage = (agentName: string): string => {
  const imageMap: Record<string, string> = {
    'hello-world-agent': 'agentsystems/hello-world-agent:latest',
    'agent-template': 'agentsystems/agent-template:latest',
    'historical-events-jokes': 'private-repository-examples/historical-events-jokes:0.1.0',
    'historical-events-poetry': 'public-repository-examples/historical-events-poetry:0.1.0',
    'ibl-agent-hello-there': 'ironbirdlabs/ibl-agent-hello-there:latest',
  }

  // Check for exact matches first
  if (imageMap[agentName]) {
    return imageMap[agentName]
  }

  // Check for partial matches (but more specific)
  for (const [key, value] of Object.entries(imageMap)) {
    if (agentName.includes(key)) {
      return value
    }
  }

  // Fallback to generic format
  return `${agentName}:latest`
}

/**
 * Extract version tag from agent image string
 */
export const getAgentVersion = (agentName: string): string => {
  const imageString = getAgentImage(agentName)
  const parts = imageString.split(':')
  if (parts.length > 1) {
    const tag = parts[parts.length - 1]
    return tag === 'latest' ? 'latest' : `v${tag}`
  }
  return 'latest'
}

/**
 * Get status badge variant based on agent state
 */
export const getStatusVariant = (state: string): string => {
  switch (state) {
    case 'running':
      return 'running'
    case 'stopped':
      return 'stopped'
    case 'not-created':
      return 'notcreated'
    default:
      return 'notcreated'
  }
}

/**
 * Convert API agent state to user-friendly display state
 */
export const getAgentDisplayState = (apiState: string): string => {
  switch (apiState) {
    case 'running':
      return 'on'
    case 'stopped':
    case 'not-created':
      return 'off'
    default:
      return 'off'
  }
}

/**
 * Get user-friendly button text for agent state
 */
export const getAgentButtonText = (apiState: string): string => {
  switch (apiState) {
    case 'running':
      return 'Turn Off'
    case 'stopped':
    case 'not-created':
      return 'Turn On'
    default:
      return 'Turn On'
  }
}

/**
 * Format agent uptime
 */
export const formatUptime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h`
  } else {
    return `${Math.floor(seconds / 86400)}d`
  }
}

/**
 * Get friendly error message for agent operations
 */
export const getAgentErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      return 'Agent not found. It may have been removed or is not running.'
    }
    if (error.message.includes('timeout')) {
      return 'Agent took too long to respond. It may be overloaded.'
    }
    if (error.message.includes('network')) {
      return 'Network error. Check your connection to the gateway.'
    }
    return error.message
  }
  return 'An unexpected error occurred'
}