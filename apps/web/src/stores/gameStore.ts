import { create } from 'zustand';
import type {
  Card,
  GameState,
  PendingAction,
  ActionCardType,
} from '@crossings/shared';

interface GameStore {
  // Game state
  gameState: GameState | null;
  myHand: Card[];
  myPlayerId: string | null;
  isMyTurn: boolean;
  currentQuestion: Card | null;
  pendingAction: PendingAction | null;

  // UI state
  selectedCardId: string | null;
  isAnswering: boolean;
  showActionModal: boolean;
  actionModalType: ActionCardType | null;

  // Timer
  timerSecondsRemaining: number | null;
  timerEndsAt: Date | null;

  // Actions
  setGameState: (state: GameState) => void;
  updateGameState: (partial: Partial<GameState>) => void;
  setMyHand: (cards: Card[]) => void;
  addToHand: (card: Card) => void;
  removeFromHand: (cardId: string) => void;
  setMyPlayerId: (id: string) => void;
  selectCard: (cardId: string | null) => void;
  setIsAnswering: (value: boolean) => void;
  setCurrentQuestion: (card: Card | null) => void;
  setPendingAction: (action: PendingAction | null) => void;
  showAction: (type: ActionCardType) => void;
  hideActionModal: () => void;
  setTimer: (seconds: number | null, endsAt: Date | null) => void;
  tickTimer: () => void;
  reset: () => void;
}

const initialState = {
  gameState: null,
  myHand: [],
  myPlayerId: null,
  isMyTurn: false,
  currentQuestion: null,
  pendingAction: null,
  selectedCardId: null,
  isAnswering: false,
  showActionModal: false,
  actionModalType: null,
  timerSecondsRemaining: null,
  timerEndsAt: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setGameState: (state) => {
    const myPlayerId = get().myPlayerId;
    const isMyTurn =
      myPlayerId !== null &&
      state.turnOrder[state.currentPlayerIndex] === myPlayerId;

    set({
      gameState: state,
      isMyTurn,
      pendingAction: state.pendingAction || null,
    });
  },

  updateGameState: (partial) => {
    const current = get().gameState;
    if (!current) return;

    const newState = { ...current, ...partial };
    const myPlayerId = get().myPlayerId;
    const isMyTurn =
      myPlayerId !== null &&
      newState.turnOrder[newState.currentPlayerIndex] === myPlayerId;

    set({
      gameState: newState,
      isMyTurn,
      pendingAction: partial.pendingAction ?? get().pendingAction,
    });
  },

  setMyHand: (cards) => set({ myHand: cards }),

  addToHand: (card) =>
    set((state) => ({
      myHand: [...state.myHand, card],
    })),

  removeFromHand: (cardId) =>
    set((state) => ({
      myHand: state.myHand.filter((c) => c.id !== cardId),
      selectedCardId:
        state.selectedCardId === cardId ? null : state.selectedCardId,
    })),

  setMyPlayerId: (id) => set({ myPlayerId: id }),

  selectCard: (cardId) => set({ selectedCardId: cardId }),

  setIsAnswering: (value) => set({ isAnswering: value }),

  setCurrentQuestion: (card) => set({ currentQuestion: card }),

  setPendingAction: (action) => set({ pendingAction: action }),

  showAction: (type) =>
    set({
      showActionModal: true,
      actionModalType: type,
    }),

  hideActionModal: () =>
    set({
      showActionModal: false,
      actionModalType: null,
    }),

  setTimer: (seconds, endsAt) =>
    set({
      timerSecondsRemaining: seconds,
      timerEndsAt: endsAt,
    }),

  tickTimer: () => {
    const { timerEndsAt } = get();
    if (!timerEndsAt) return;

    const now = new Date();
    const remaining = Math.max(
      0,
      Math.floor((timerEndsAt.getTime() - now.getTime()) / 1000)
    );
    set({ timerSecondsRemaining: remaining });
  },

  reset: () => set(initialState),
}));

// Selectors
export const selectIsPlaying = (state: GameStore) =>
  state.gameState?.phase === 'playing';

export const selectIsLobby = (state: GameStore) =>
  state.gameState?.phase === 'lobby';

export const selectIsFinalRitual = (state: GameStore) =>
  state.gameState?.phase === 'final_ritual';

export const selectCurrentPlayerId = (state: GameStore) => {
  if (!state.gameState) return null;
  return state.gameState.turnOrder[state.gameState.currentPlayerIndex];
};

export const selectCanPlayCard = (state: GameStore) => {
  return (
    state.isMyTurn &&
    state.gameState?.phase === 'playing' &&
    !state.isAnswering &&
    !state.pendingAction
  );
};
