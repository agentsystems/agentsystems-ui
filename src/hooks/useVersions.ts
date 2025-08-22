/**
 * Hook for fetching component version information
 * 
 * Queries both UI and gateway version endpoints to provide
 * comprehensive version information for display.
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '@api/client'

interface ComponentVersions {
  ui_version: string
  gateway_version: string
  latest_versions: {
    ui: string
    gateway: string
  }
  update_available: {
    ui: boolean
    gateway: boolean
  }
}

/**
 * Fetch all component versions from centralized endpoint
 */
const fetchComponentVersions = async () => {
  try {
    return await api.get('/component-versions')
  } catch (error) {
    console.warn('Failed to fetch component versions:', error)
    return { components: {} }
  }
}

/**
 * Hook to get comprehensive version information
 */
export const useVersions = () => {
  const { data: componentVersions } = useQuery({
    queryKey: ['component-versions'],
    queryFn: fetchComponentVersions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const components = componentVersions?.components || {}
  const acp = components['agent-control-plane'] || {}
  const ui = components['agentsystems-ui'] || {}

  const versions: ComponentVersions = {
    ui_version: ui.current_version || 'unknown',
    gateway_version: acp.current_version || 'unknown',
    latest_versions: {
      ui: ui.latest_version || 'unknown',
      gateway: acp.latest_version || 'unknown',
    },
    update_available: {
      ui: ui.update_available || false,
      gateway: acp.update_available || false,
    }
  }

  return versions
}