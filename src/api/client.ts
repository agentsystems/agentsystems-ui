import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@stores/authStore'
import { API_DEFAULTS } from '@constants/app'

/**
 * HTTP client for AgentSystems API with automatic authentication and error handling
 * 
 * Features:
 * - Automatic auth token injection from auth store
 * - Development proxy support (uses /api prefix)
 * - Production direct connection to gateway
 * - Automatic 401 handling (clears invalid tokens)
 * - Configurable timeout and headers
 */
class ApiClient {
  private client: AxiosInstance

  /**
   * Initialize the API client with interceptors and default configuration
   */
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

/**
 * Simplified API helper functions for common HTTP operations
 * 
 * All functions return Promise<T> with the response data directly.
 * Error handling is managed by the underlying axios client.
 */
export const api = {
  /**
   * Perform a GET request
   * @param url - Endpoint URL (relative to base URL)
   * @param params - Query parameters to include
   * @returns Promise with response data
   */
  get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),
  
  /** 
   * Perform a POST request
   * @param url - Endpoint URL
   * @param data - Request body data
   */
  post: <T = unknown>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),
  
  /** 
   * Perform a PUT request
   * @param url - Endpoint URL
   * @param data - Request body data
   */
  put: <T = unknown>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),
  
  /** 
   * Perform a DELETE request
   * @param url - Endpoint URL
   */
  delete: <T = unknown>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),
  
  /** 
   * Upload files via multipart form data
   * @param url - Endpoint URL
   * @param formData - FormData object containing files and fields
   */
  upload: <T = unknown>(url: string, formData: FormData) =>
    apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),
}