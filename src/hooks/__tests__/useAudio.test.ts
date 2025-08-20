import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAudio } from '../useAudio'

// Mock the audio functions
vi.mock('@utils/audioFx', () => ({
  playCyberClick: vi.fn(),
  isAudioEnabled: vi.fn().mockReturnValue(true),
}))

// Mock the theme store
vi.mock('@stores/themeStore', () => ({
  useThemeStore: vi.fn(),
}))

import { playCyberClick, isAudioEnabled } from '@utils/audioFx'
import { useThemeStore } from '@stores/themeStore'
import type { Theme } from '../../types/common'

const mockedPlayCyberClick = vi.mocked(playCyberClick)
const mockedIsAudioEnabled = vi.mocked(isAudioEnabled)
const mockedUseThemeStore = vi.mocked(useThemeStore)

describe('useAudio Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('plays cyber click sound when theme is cyber and audio is enabled', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'cyber' as Theme })
    mockedIsAudioEnabled.mockReturnValue(true)

    const { result } = renderHook(() => useAudio())
    
    result.current.playClickSound()

    expect(mockedPlayCyberClick).toHaveBeenCalledTimes(1)
  })

  it('does not play sound when audio is disabled', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'cyber' as Theme })
    mockedIsAudioEnabled.mockReturnValue(false)

    const { result } = renderHook(() => useAudio())
    
    result.current.playClickSound()

    expect(mockedPlayCyberClick).not.toHaveBeenCalled()
  })

  it('does not play sound when theme is not cyber', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'dark' as Theme })
    mockedIsAudioEnabled.mockReturnValue(true)

    const { result } = renderHook(() => useAudio())
    
    result.current.playClickSound()

    expect(mockedPlayCyberClick).not.toHaveBeenCalled()
  })

  it('handles audio errors gracefully', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'cyber' as Theme })
    mockedIsAudioEnabled.mockReturnValue(true)
    mockedPlayCyberClick.mockImplementation(() => {
      throw new Error('Audio context failed')
    })

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useAudio())
    
    expect(() => result.current.playClickSound()).not.toThrow()
    expect(consoleSpy).toHaveBeenCalledWith('Failed to play audio:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('returns stable function reference', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'cyber' as Theme })

    const { result, rerender } = renderHook(() => useAudio())
    const firstRender = result.current.playClickSound

    rerender()
    const secondRender = result.current.playClickSound

    expect(firstRender).toBe(secondRender)
  })
})