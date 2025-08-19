/**
 * Theme store for managing application theming and visual preferences
 * 
 * Manages:
 * - Theme selection (dark, light, cyber)
 * - Cyber theme scanline effects
 * - Scanline frequency configuration (30s, 90s, 300s)
 * - Persistent storage of preferences
 * - System theme detection and initialization
 * 
 * All preferences are automatically persisted to localStorage and restored on app startup.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, ScanlineFrequency } from '../types/common'

interface ThemeStore {
  /** Current active theme */
  theme: Theme
  /** Whether scanline effects are enabled (cyber theme only) */
  scanlineEnabled: boolean
  /** Frequency of scanline sweeps in seconds */
  scanlineFrequency: ScanlineFrequency
  /** Set the active theme */
  setTheme: (theme: Theme) => void
  /** Enable or disable scanline effects */
  setScanlineEnabled: (enabled: boolean) => void
  /** Set scanline sweep frequency */
  setScanlineFrequency: (frequency: ScanlineFrequency) => void
  /** Initialize theme from localStorage or system preference */
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