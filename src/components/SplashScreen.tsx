import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTourStore } from '@stores/tourStore'
import styles from './SplashScreen.module.css'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const { resetTour } = useTourStore()

  useEffect(() => {
    // Random duration between 4-5 seconds, decided once
    const duration = 4000 + Math.random() * 1000

    // Always have at least 1 pause, 50% chance of a second pause
    const pauseCount = Math.random() < 0.5 ? 2 : 1
    const pausePoints: { progress: number; duration: number }[] = []

    // First pause (always happens)
    pausePoints.push({
      progress: 40 + Math.random() * 40, // Between 40-80%
      duration: Math.random() < 0.5 ? 500 : 1000 // Either 0.5s or 1s
    })

    // Second pause (50% chance)
    if (pauseCount === 2) {
      pausePoints.push({
        progress: 40 + Math.random() * 40, // Between 40-80%
        duration: Math.random() < 0.5 ? 500 : 1000 // Either 0.5s or 1s
      })
    }

    // Sort pause points by progress
    pausePoints.sort((a, b) => a.progress - b.progress)

    const startTime = Date.now()
    let totalPauseTime = 0
    let currentPauseIndex = 0
    let isPaused = false
    let pauseStartTime = 0
    const updateInterval = 16 // ~60fps

    const intervalId = setInterval(() => {
      // Check if we're currently paused
      if (isPaused) {
        const pauseDuration = pausePoints[currentPauseIndex].duration
        if (Date.now() - pauseStartTime >= pauseDuration) {
          // Pause is over
          totalPauseTime += pauseDuration
          isPaused = false
          currentPauseIndex++
        }
        // While paused, don't update progress
        return
      }

      // Calculate progress accounting for pauses
      const elapsed = Date.now() - startTime - totalPauseTime
      const currentProgress = (elapsed / duration) * 100

      // Check if we should start a new pause
      if (!isPaused && currentPauseIndex < pausePoints.length) {
        const pausePoint = pausePoints[currentPauseIndex]
        if (currentProgress >= pausePoint.progress) {
          isPaused = true
          pauseStartTime = Date.now()
          // Hold at the pause point progress
          setProgress(pausePoint.progress)
          return
        }
      }

      // Check if we're done
      if (elapsed >= duration) {
        // We've reached the end
        clearInterval(intervalId)
        setProgress(100) // Set to exactly 100%

        // Small delay to show 100% before navigating
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 200)
      } else {
        // Update progress normally
        setProgress(currentProgress)
      }
    }, updateInterval)

    return () => clearInterval(intervalId)
  }, [navigate])

  // Add keyboard shortcut to reset tour (Shift + T)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'T') {
        console.log('SplashScreen: Resetting tour state...')
        resetTour()
        localStorage.removeItem('tour-storage')
        console.log('Tour state cleared - will start fresh on dashboard')
        // Don't reload, just let the navigation continue normally
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [resetTour])

  return (
    <div className={styles.splashScreen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img
            src="/fitted-icon.png"
            alt="AgentSystems"
            className={styles.logoIcon}
          />
          <div className={styles.tagline}>The Open Platform for AI Agents</div>
        </div>

        <div className={styles.loader}>
          <div className={styles.loadingBar}>
            <div
              className={styles.loadingProgress}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.loadingText}>
            Initializing AgentSystems... {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  )
}