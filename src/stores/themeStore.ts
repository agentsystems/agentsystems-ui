import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'cyber'

export type ScanlineFrequency = '30' | '90' | '300'

interface ThemeStore {
  theme: Theme
  scanlineEnabled: boolean
  scanlineFrequency: ScanlineFrequency
  setTheme: (theme: Theme) => void
  setScanlineEnabled: (enabled: boolean) => void
  setScanlineFrequency: (frequency: ScanlineFrequency) => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      scanlineEnabled: false, // Default to off for better UX
      scanlineFrequency: '90', // Default to 90 seconds
      setTheme: (theme) => set({ theme }),
      setScanlineEnabled: (enabled) => set({ scanlineEnabled: enabled }),
      setScanlineFrequency: (frequency) => set({ scanlineFrequency: frequency }),
      initTheme: () => {
        // Initialize theme from localStorage or system preference
        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.state?.theme) {
              return
            }
          } catch (e) {
            console.error('Failed to parse stored theme:', e)
          }
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          set({ theme: 'light' })
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)