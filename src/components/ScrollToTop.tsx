import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll the window to top
    window.scrollTo(0, 0)

    // Also scroll the document element and body in case they have scroll
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Find and reset any scrollable containers (like main content areas)
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.scrollTop = 0
    }

    // Also check for any element with role="main"
    const mainRole = document.querySelector('[role="main"]')
    if (mainRole) {
      mainRole.scrollTop = 0
    }
  }, [pathname])

  return null
}