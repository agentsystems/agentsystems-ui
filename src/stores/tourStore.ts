/**
 * Tour store for managing onboarding tour state and preferences
 * 
 * Manages:
 * - Tour completion tracking
 * - Tour type preferences (execution-first vs configuration-first)
 * - Persistent storage of tour state
 * - Manual tour restart capability
 * 
 * All preferences are automatically persisted to localStorage and restored on app startup.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TourStore {
  /** Whether user has completed the onboarding tour */
  hasCompletedTour: boolean
  /** Type of tour completed (for future multiple tour types) */
  completedTourType: 'execution-first' | 'configuration-first' | null
  /** Timestamp when tour was completed */
  completedAt: string | null
  /** Whether a tour is currently active */
  isTourActive: boolean
  /** Mark tour as completed */
  markTourComplete: (tourType: 'execution-first' | 'configuration-first') => void
  /** Reset tour state (for manual restart) */
  resetTour: () => void
  /** Check if user should see tour on first visit */
  shouldShowTour: () => boolean
  /** Set tour active state */
  setTourActive: (active: boolean) => void
}

export const useTourStore = create<TourStore>()(
  persist(
    (set, get) => ({
      hasCompletedTour: false,
      completedTourType: null,
      completedAt: null,
      isTourActive: false,

      markTourComplete: (tourType) => set({
        hasCompletedTour: true,
        completedTourType: tourType,
        completedAt: new Date().toISOString(),
        isTourActive: false
      }),

      resetTour: () => set({
        hasCompletedTour: false,
        completedTourType: null,
        completedAt: null,
        isTourActive: false
      }),

      shouldShowTour: () => {
        const state = get()
        return !state.hasCompletedTour
      },

      setTourActive: (active) => set({ isTourActive: active })
    }),
    {
      name: 'tour-storage',
      // Don't persist the isTourActive state
      partialize: (state) => ({
        hasCompletedTour: state.hasCompletedTour,
        completedTourType: state.completedTourType,
        completedAt: state.completedAt
      })
    }
  )
)