// Runtime configuration that works in both development and production

interface RuntimeConfig {
  API_GATEWAY_URL: string
  WS_ENDPOINT_URL: string
}

const getConfig = (): RuntimeConfig => {
  // In development, use Vite environment variables
  if (import.meta.env.DEV) {
    return {
      API_GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:18080',
      WS_ENDPOINT_URL: import.meta.env.VITE_WS_ENDPOINT_URL || 'ws://localhost:18080',
    }
  }

  // In production, use runtime-injected config from window
  const runtimeConfig = (window as unknown as { __RUNTIME_CONFIG__?: RuntimeConfig }).__RUNTIME_CONFIG__
  if (runtimeConfig) {
    return {
      API_GATEWAY_URL: runtimeConfig.API_GATEWAY_URL || 'http://localhost:18080',
      WS_ENDPOINT_URL: runtimeConfig.WS_ENDPOINT_URL || 'ws://localhost:18080',
    }
  }

  // Fallback to defaults
  return {
    API_GATEWAY_URL: 'http://localhost:18080',
    WS_ENDPOINT_URL: 'ws://localhost:18080',
  }
}

export const config = getConfig()