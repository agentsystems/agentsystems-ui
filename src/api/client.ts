import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@stores/authStore'
import { API_DEFAULTS } from '@constants/app'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      timeout: API_DEFAULTS.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token and base URL
    this.client.interceptors.request.use(
      (config) => {
        const { token, gatewayUrl } = useAuthStore.getState()
        
        // In development, use Vite proxy to avoid CORS issues
        if (import.meta.env.DEV) {
          config.baseURL = '/api'
        } else {
          // In production, use the configured gateway URL
          config.baseURL = gatewayUrl
        }
        
        // Add auth header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          useAuthStore.getState().setToken(null)
        }
        return Promise.reject(error)
      }
    )
  }

  get instance() {
    return this.client
  }
}

export const apiClient = new ApiClient().instance

// Helper functions for common requests
export const api = {
  get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),
  
  post: <T = unknown>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),
  
  put: <T = unknown>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),
  
  delete: <T = unknown>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),
  
  upload: <T = unknown>(url: string, formData: FormData) =>
    apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),
}