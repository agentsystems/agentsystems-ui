import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: string | null
  gatewayUrl: string
  wsUrl: string
  setToken: (token: string | null) => void
  setGatewayUrl: (url: string) => void
  setWsUrl: (url: string) => void
  isAuthenticated: () => boolean
}

// Get runtime config or use defaults
const getRuntimeConfig = () => {
  const config = (window as any).__RUNTIME_CONFIG__ || {}
  return {
    gatewayUrl: config.API_GATEWAY_URL || 'http://localhost:18080',
    wsUrl: config.WS_ENDPOINT_URL || 'ws://localhost:18080',
  }
}

const { gatewayUrl, wsUrl } = getRuntimeConfig()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: 'demo', // Default demo token
      gatewayUrl,
      wsUrl,
      
      setToken: (token) => set({ token }),
      setGatewayUrl: (url) => set({ gatewayUrl: url }),
      setWsUrl: (url) => set({ wsUrl: url }),
      
      isAuthenticated: () => {
        const state = get()
        return !!state.token
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
)