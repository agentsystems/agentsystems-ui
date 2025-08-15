import { useCallback } from 'react'
import { useThemeStore } from '@stores/themeStore'
import { playCyberClick, playUIClick, isAudioEnabled } from '@utils/audioFx'

/**
 * Hook for playing theme-appropriate audio effects
 */
export const useAudio = () => {
  const { theme } = useThemeStore()

  const playClickSound = useCallback(() => {
    console.log('playClickSound called - theme:', theme, 'audioEnabled:', isAudioEnabled())
    
    if (!isAudioEnabled()) {
      console.log('Audio disabled by user setting')
      return
    }

    try {
      if (theme === 'cyber') {
        console.log('Playing cyber click sound')
        playCyberClick()
      } else {
        console.log('Non-cyber theme, no sound')
        // For now, only cyber theme has sounds
        // Could add subtle sounds for other themes later
      }
    } catch (error) {
      console.warn('Failed to play audio:', error)
    }
  }, [theme])

  return {
    playClickSound,
  }
}