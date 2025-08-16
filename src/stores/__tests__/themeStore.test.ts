import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../themeStore'
import { act, renderHook } from '@testing-library/react'

describe('Theme Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('initializes with default theme', () => {
    const { result } = renderHook(() => useThemeStore())
    
    expect(result.current.theme).toBe('dark')
    expect(result.current.scanlineEnabled).toBe(false)
    expect(result.current.scanlineFrequency).toBe('90')
  })

  it('updates theme correctly', () => {
    const { result } = renderHook(() => useThemeStore())
    
    act(() => {
      result.current.setTheme('cyber')
    })
    
    expect(result.current.theme).toBe('cyber')
  })

  it('updates scanline settings correctly', () => {
    const { result } = renderHook(() => useThemeStore())
    
    act(() => {
      result.current.setScanlineEnabled(true)
    })
    
    expect(result.current.scanlineEnabled).toBe(true)
    
    act(() => {
      result.current.setScanlineFrequency('300')
    })
    
    expect(result.current.scanlineFrequency).toBe('300')
  })

  it('persists theme settings to localStorage', () => {
    const { result } = renderHook(() => useThemeStore())
    
    act(() => {
      result.current.setTheme('light')
      result.current.setScanlineEnabled(true)
    })

    // Create a new instance to test persistence
    const { result: newResult } = renderHook(() => useThemeStore())
    
    expect(newResult.current.theme).toBe('light')
    expect(newResult.current.scanlineEnabled).toBe(true)
  })

  it('handles invalid stored data gracefully', () => {
    // Set invalid data in localStorage
    localStorage.setItem('theme-storage', 'invalid-json')
    
    const { result } = renderHook(() => useThemeStore())
    
    // Should fall back to defaults
    expect(result.current.theme).toBe('dark')
    expect(result.current.scanlineEnabled).toBe(false)
  })
})