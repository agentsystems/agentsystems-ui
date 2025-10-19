import { Routes, Route } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import MainLayout from '@components/layouts/MainLayout'
import ErrorBoundary from '@components/ErrorBoundary'
import SkipLinks from '@components/SkipLinks'
import LoadingSpinner from '@components/LoadingSpinner'
import ScrollToTop from '@components/ScrollToTop'
import { useThemeStore } from '@stores/themeStore'
import { useConfigStore } from '@stores/configStore'
import { useScanline } from '@hooks/useScanline'

// Lazy-loaded components for code splitting
const SplashScreen = lazy(() => import('@components/SplashScreen'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Agents = lazy(() => import('@pages/Agents'))
const Marketplace = lazy(() => import('@pages/Marketplace'))
const Discover = lazy(() => import('@pages/Discover'))
const Executions = lazy(() => import('@pages/Executions'))
const Logs = lazy(() => import('@pages/Logs'))
const ConfigurationOverview = lazy(() => import('@pages/ConfigurationOverview'))
const CredentialsPage = lazy(() => import('@pages/configuration/CredentialsPage'))
const RegistryConnectionsPage = lazy(() => import('@pages/configuration/RegistryConnectionsPage'))
const IndexConnectionsPage = lazy(() => import('@pages/configuration/IndexConnectionsPage'))
const AgentConnectionsPage = lazy(() => import('@pages/configuration/AgentConnectionsPage'))
const ConnectionPage = lazy(() => import('@pages/configuration/ConnectionPage'))
const AppearancePage = lazy(() => import('@pages/configuration/AppearancePage'))
const ModelConnectionsPage = lazy(() => import('@pages/configuration/ModelConnectionsPage'))
const AgentDetail = lazy(() => import('@pages/AgentDetail'))
const Support = lazy(() => import('@pages/Support'))

function App() {
  const { theme, scanlineEnabled, initTheme } = useThemeStore()
  const { loadConfig } = useConfigStore()

  // Initialize scanline timing system
  useScanline()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  // Load configuration from YAML file on mount (single source of truth)
  useEffect(() => {
    loadConfig()
  }, [loadConfig])

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
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Splash screen only on root path */}
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SplashScreen />
            </Suspense>
          } />

          {/* Main app routes */}
          <Route path="/" element={<MainLayout />}>
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
            <Route path="ecosystem" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Marketplace />
              </Suspense>
            } />
            {/* Legacy marketplace route for backward compatibility */}
            <Route path="marketplace" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Marketplace />
              </Suspense>
            } />
            <Route path="discover" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Discover />
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
            <Route path="configuration/registry-connections" element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegistryConnectionsPage />
              </Suspense>
            } />
            <Route path="configuration/index-connections" element={
              <Suspense fallback={<LoadingSpinner />}>
                <IndexConnectionsPage />
              </Suspense>
            } />
            <Route path="configuration/agent-connections" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AgentConnectionsPage />
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
            <Route path="configuration/model-connections" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ModelConnectionsPage />
              </Suspense>
            } />
            <Route path="support" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Support />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App