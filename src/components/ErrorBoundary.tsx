import { Component, ReactNode } from 'react'
import { captureException, addSentryBreadcrumb } from '@config/sentry'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log breadcrumb and capture error in Sentry
    addSentryBreadcrumb(
      `Error boundary caught: ${error.message}`,
      'error',
    )
    
    captureException(error, {
      errorBoundary: true,
      componentStack: errorInfo.componentStack,
      errorBoundaryLocation: 'global',
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.reloadButton}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}