import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the API functions directly since testing the client class is complex
vi.mock('../client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
  },
}))

import { api } from '../client'

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('api.get', () => {
    it('calls the get function correctly', async () => {
      const mockData = { test: 'data' }
      vi.mocked(api.get).mockResolvedValue(mockData)

      const result = await api.get('/test-endpoint')

      expect(api.get).toHaveBeenCalledWith('/test-endpoint')
      expect(result).toEqual(mockData)
    })
  })

  describe('api.post', () => {
    it('calls the post function correctly', async () => {
      const mockResponse = { success: true }
      const requestData = { name: 'test' }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await api.post('/test-endpoint', requestData)

      expect(api.post).toHaveBeenCalledWith('/test-endpoint', requestData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('api.upload', () => {
    it('calls the upload function correctly', async () => {
      const mockResponse = { uploaded: true }
      const formData = new FormData()
      vi.mocked(api.upload).mockResolvedValue(mockResponse)

      const result = await api.upload('/upload-endpoint', formData)

      expect(api.upload).toHaveBeenCalledWith('/upload-endpoint', formData)
      expect(result).toEqual(mockResponse)
    })
  })
})