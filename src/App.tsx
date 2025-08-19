import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from '@components/layouts/MainLayout'
import Dashboard from '@pages/Dashboard'
import Agents from '@pages/Agents'
import Executions from '@pages/Executions'
import Logs from '@pages/Logs'
import Settings from '@pages/Settings'
import ConfigurationOverview from '@pages/ConfigurationOverview'
import CredentialsPage from '@pages/configuration/CredentialsPage'
import RegistriesPage from '@pages/configuration/RegistriesPage'
import ConnectionPage from '@pages/configuration/ConnectionPage'
import AgentDetail from '@pages/AgentDetail'
import ErrorBoundary from '@components/ErrorBoundary'
import SkipLinks from '@components/SkipLinks'
import { useThemeStore } from '@stores/themeStore'
import { useScanline } from '@hooks/useScanline'

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
    console.log('Applying theme classes:', classes.join(' '))
    document.documentElement.className = classes.join(' ')
  }, [theme, scanlineEnabled])


  return (
    <ErrorBoundary>
      <SkipLinks />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:agentName" element={<AgentDetail />} />
          <Route path="executions" element={<Executions />} />
          <Route path="logs" element={<Logs />} />
          <Route path="configuration" element={<ConfigurationOverview />} />
          <Route path="configuration/credentials" element={<CredentialsPage />} />
          <Route path="configuration/registries" element={<RegistriesPage />} />
          <Route path="configuration/connection" element={<ConnectionPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App