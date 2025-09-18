import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SplashScreen.module.css'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Random duration between 4-5 seconds, decided once
    const duration = 4000 + Math.random() * 1000
    const startTime = Date.now()
    const updateInterval = 16 // ~60fps

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime

      // Calculate progress linearly based on elapsed time
      if (elapsed >= duration) {
        // We've reached the end
        clearInterval(intervalId)
        setProgress(100) // Set to exactly 100%

        // Small delay to show 100% before navigating
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 200)
      } else {
        // Linear progress calculation
        const currentProgress = (elapsed / duration) * 100
        setProgress(currentProgress)
      }
    }, updateInterval)

    return () => clearInterval(intervalId)
  }, [navigate])

  return (
    <div className={styles.splashScreen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img
            src="/fitted-icon.png"
            alt="AgentSystems"
            className={styles.logoIcon}
          />
          <div className={styles.tagline}>A Step Towards AI Sovereignty</div>
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