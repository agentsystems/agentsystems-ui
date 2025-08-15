import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'cyber'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
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