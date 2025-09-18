import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { config } from '@/config/runtime'

interface AuthStore {
  token: string | null
  gatewayUrl: string
  wsUrl: string
  setToken: (token: string | null) => void
  setGatewayUrl: (url: string) => void
  setWsUrl: (url: string) => void
  isAuthenticated: () => boolean
}

// Default demo token - users should change this for production
const DEFAULT_DEMO_TOKEN = 'demo-token-please-change'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: DEFAULT_DEMO_TOKEN, // Pre-set demo token for initial setup
      gatewayUrl: config.API_GATEWAY_URL,
      wsUrl: config.WS_ENDPOINT_URL,
      
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