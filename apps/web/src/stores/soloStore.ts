import { create } from 'zustand';
import type { Card } from '@crossings/shared';
import { ALL_CARDS } from '../data/cards';

export type SoloPhase = 'idle' | 'playing' | 'final_stone' | 'completed';

interface SoloState {
  phase: SoloPhase;
  deck: Card[];
  currentCard: Card | null;
  sharedLore: Card[];
  bridgePasses: number;
}

interface SoloActions {
  startGame: () => void;
  drawCard: () => void;
  markShared: () => void;
  bridgePass: () => void;
  goToFinalStone: () => void;
  reset: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useSoloStore = create<SoloState & SoloActions>((set, get) => ({
  phase: 'idle',
  deck: [],
  currentCard: null,
  sharedLore: [],
  bridgePasses: 0,

  startGame: () => {
    set({
      phase: 'playing',
      deck: shuffle([...ALL_CARDS]),
      currentCard: null,
      sharedLore: [],
      bridgePasses: 0,
    });
  },

  drawCard: () => {
    const { deck } = get();
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    set({ deck: newDeck, currentCard: card });
  },

  markShared: () => {
    const { currentCard, sharedLore } = get();
    if (!currentCard) return;
    set({
      sharedLore: [...sharedLore, currentCard],
      currentCard: null,
    });
  },

  bridgePass: () => {
    const { bridgePasses, deck } = get();
    set({ bridgePasses: bridgePasses + 1, currentCard: null });
    // Auto-draw next card if deck isn't empty
    if (deck.length > 0) {
      const newDeck = [...deck];
      const card = newDeck.pop()!;
      set({ deck: newDeck, currentCard: card });
    }
  },

  goToFinalStone: () => {
    set({ phase: 'final_stone', currentCard: null });
  },

  reset: () => {
    set({
      phase: 'idle',
      deck: [],
      currentCard: null,
      sharedLore: [],
      bridgePasses: 0,
    });
  },
}));
