import { useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'success', duration })
  }, [addToast])

  const showError = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'error', duration })
  }, [addToast])

  const showWarning = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'warning', duration })
  }, [addToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'info', duration })
  }, [addToast])

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}