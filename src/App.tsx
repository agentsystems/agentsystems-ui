import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import MainLayout from '@components/layouts/MainLayout'
import ErrorBoundary from '@components/ErrorBoundary'
import SkipLinks from '@components/SkipLinks'
import LoadingSpinner from '@components/LoadingSpinner'
import { useThemeStore } from '@stores/themeStore'
import { useScanline } from '@hooks/useScanline'

// Lazy-loaded components for code splitting
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Agents = lazy(() => import('@pages/Agents'))
const Executions = lazy(() => import('@pages/Executions'))
const Logs = lazy(() => import('@pages/Logs'))
const ConfigurationOverview = lazy(() => import('@pages/ConfigurationOverview'))
const CredentialsPage = lazy(() => import('@pages/configuration/CredentialsPage'))
const RegistriesPage = lazy(() => import('@pages/configuration/RegistriesPage'))
const AgentsPage = lazy(() => import('@pages/configuration/AgentsPage'))
const ConnectionPage = lazy(() => import('@pages/configuration/ConnectionPage'))
const AppearancePage = lazy(() => import('@pages/configuration/AppearancePage'))
const AgentDetail = lazy(() => import('@pages/AgentDetail'))

function App() {
  const { theme, scanlineEnabled, initTheme } = useThemeStore()

  // Initialize scanline timing system
  useScanline()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    // Fallback to 'dark' if theme is not yet loaded from localStorage
    const currentTheme = theme || 'dark'
    const classes = [`theme-${currentTheme}`]
    if (currentTheme === 'cyber' && scanlineEnabled) {
      classes.push('scanline-enabled')
    }
    // Apply theme classes to document root
    document.documentElement.className = classes.join(' ')
  }, [theme, scanlineEnabled])


  return (
    <ErrorBoundary>
      <SkipLinks />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="agents" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Agents />
              </Suspense>
            } />
            <Route path="agents/:agentName" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AgentDetail />
              </Suspense>
            } />
            <Route path="executions" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Executions />
              </Suspense>
            } />
            <Route path="logs" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Logs />
              </Suspense>
            } />
            <Route path="configuration" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ConfigurationOverview />
              </Suspense>
            } />
            <Route path="configuration/credentials" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CredentialsPage />
              </Suspense>
            } />
            <Route path="configuration/registries" element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegistriesPage />
              </Suspense>
            } />
            <Route path="configuration/agents" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AgentsPage />
              </Suspense>
            } />
            <Route path="configuration/connection" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ConnectionPage />
              </Suspense>
            } />
            <Route path="configuration/appearance" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AppearancePage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App