import { Component, ReactNode } from 'react'
import { captureException, addSentryBreadcrumb } from '@config/sentry'

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
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--error)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          margin: '2rem'
        }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}