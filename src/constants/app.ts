/**
 * Application constants
 * Single source of truth for values used across the application
 */

export const APP_VERSION = '0.1.0'

export const APP_NAME = 'AgentSystems'

export const APP_TITLE = 'AgentSystems • Mission Control'

export const API_DEFAULTS = {
  GATEWAY_URL: 'http://localhost:18080',
  WS_URL: 'ws://localhost:18080',
  TIMEOUT: 30000,
  RETRY_COUNT: 2,
  REFETCH_INTERVAL: 5000,
} as const

export const ROUTES = {
  DASHBOARD: '/dashboard',
  AGENTS: '/agents',
  LOGS: '/logs',
  SETTINGS: '/settings',
} as const

export const THEME_DEFAULTS = {
  DEFAULT_THEME: 'dark',
  SCANLINE_FREQUENCY: '90',
  AUDIO_ENABLED: false,
} as const

export const AGENT_STATES = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  NOT_CREATED: 'not-created',
} as const

export const INVOCATION_STATES = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const