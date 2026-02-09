import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioStore {
  // State
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isAmbientPlaying: boolean;

  // Actions
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientPlaying: (playing: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, _get) => ({
      isMuted: false,
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      isAmbientPlaying: false,

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setMasterVolume: (volume) =>
        set({ masterVolume: Math.max(0, Math.min(1, volume)) }),

      setMusicVolume: (volume) =>
        set({ musicVolume: Math.max(0, Math.min(1, volume)) }),

      setSfxVolume: (volume) =>
        set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),

      setAmbientPlaying: (playing) => set({ isAmbientPlaying: playing }),
    }),
    {
      name: 'crossings-audio-settings',
      partialize: (state) => ({
        isMuted: state.isMuted,
        masterVolume: state.masterVolume,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
      }),
    }
  )
);

// Computed volume getters
export const getEffectiveMusicVolume = (state: AudioStore) => {
  if (state.isMuted) return 0;
  return state.masterVolume * state.musicVolume;
};

export const getEffectiveSfxVolume = (state: AudioStore) => {
  if (state.isMuted) return 0;
  return state.masterVolume * state.sfxVolume;
};
