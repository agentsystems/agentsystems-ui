import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from '@components/layouts/MainLayout'
import Dashboard from '@pages/Dashboard'
import Agents from '@pages/Agents'
import Logs from '@pages/Logs'
import Settings from '@pages/Settings'
import AgentDetail from '@pages/AgentDetail'
import { useThemeStore } from '@stores/themeStore'

function App() {
  const { theme, initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agents" element={<Agents />} />
        <Route path="agents/:agentName" element={<AgentDetail />} />
        <Route path="logs" element={<Logs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App