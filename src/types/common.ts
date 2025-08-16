/**
 * Common type definitions shared across the application
 */

export type Theme = 'dark' | 'light' | 'cyber'

export type ScanlineFrequency = '30' | '90' | '300'

export interface AppConfig {
  apiGatewayUrl: string
  wsEndpointUrl: string
  theme: Theme
  audioEnabled: boolean
  scanlineEnabled: boolean
  scanlineFrequency: ScanlineFrequency
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  status?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}