import { useEffect } from 'react'
import { useThemeStore } from '@stores/themeStore'

const getRandomizedInterval = (baseSeconds: number): number => {
  // Add ±20% randomization to the base interval
  const variation = baseSeconds * 0.2
  const randomOffset = (Math.random() - 0.5) * 2 * variation
  return (baseSeconds + randomOffset) * 1000 // Convert to milliseconds
}

export const useScanline = () => {
  const { theme, scanlineEnabled, scanlineFrequency } = useThemeStore()

  useEffect(() => {
    if (theme !== 'cyber' || !scanlineEnabled) {
      return
    }

    const baseSeconds = parseInt(scanlineFrequency)
    let timeoutId: NodeJS.Timeout

    const triggerScanline = () => {
      // Add scanline class to trigger animation
      document.body.classList.add('scanline-active')
      
      // Remove class after animation completes (6 seconds for the sweep)
      setTimeout(() => {
        document.body.classList.remove('scanline-active')
      }, 6000)

      // Schedule next scanline with randomized timing
      const nextInterval = getRandomizedInterval(baseSeconds)
      timeoutId = setTimeout(triggerScanline, nextInterval)
    }

    // Start the first scanline with initial randomized delay
    const initialDelay = getRandomizedInterval(baseSeconds)
    timeoutId = setTimeout(triggerScanline, initialDelay)

    return () => {
      clearTimeout(timeoutId)
      document.body.classList.remove('scanline-active')
    }
  }, [theme, scanlineEnabled, scanlineFrequency])
}