/**
 * Global type declarations for AgentSystems UI
 */

interface RuntimeConfig {
  API_GATEWAY_URL: string
  WS_ENDPOINT_URL: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

export {}