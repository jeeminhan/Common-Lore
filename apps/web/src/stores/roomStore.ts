import { create } from 'zustand';
import type { Room, Player, RoomSettings, PlayerStatus } from '@crossings/shared';

interface RoomStore {
  // Room state
  room: Room | null;
  myPlayerId: string | null;
  sessionToken: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;

  // Actions
  setRoom: (room: Room) => void;
  updateRoom: (partial: Partial<Room>) => void;
  setMyPlayerId: (id: string) => void;
  setSessionToken: (token: string) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerStatus: (playerId: string, status: PlayerStatus) => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  setConnected: (value: boolean) => void;
  setConnecting: (value: boolean) => void;
  setConnectionError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  room: null,
  myPlayerId: null,
  sessionToken: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  ...initialState,

  setRoom: (room) => set({ room }),

  updateRoom: (partial) => {
    const current = get().room;
    if (!current) return;
    set({ room: { ...current, ...partial } });
  },

  setMyPlayerId: (id) => set({ myPlayerId: id }),

  setSessionToken: (token) => {
    set({ sessionToken: token });
    // Persist to localStorage for reconnection
    if (typeof window !== 'undefined') {
      localStorage.setItem('crossings_session_token', token);
    }
  },

  addPlayer: (player) => {
    const current = get().room;
    if (!current) return;
    // Avoid duplicates
    if (current.players.some((p) => p.id === player.id)) return;
    set({
      room: {
        ...current,
        players: [...current.players, player],
      },
    });
  },

  removePlayer: (playerId) => {
    const current = get().room;
    if (!current) return;
    set({
      room: {
        ...current,
        players: current.players.filter((p) => p.id !== playerId),
      },
    });
  },

  updatePlayerStatus: (playerId, status) => {
    const current = get().room;
    if (!current) return;
    set({
      room: {
        ...current,
        players: current.players.map((p) =>
          p.id === playerId ? { ...p, status } : p
        ),
      },
    });
  },

  updateSettings: (settings) => {
    const current = get().room;
    if (!current) return;
    set({
      room: {
        ...current,
        settings: { ...current.settings, ...settings },
      },
    });
  },

  setConnected: (value) => set({ isConnected: value, isConnecting: false }),

  setConnecting: (value) => set({ isConnecting: value }),

  setConnectionError: (error) =>
    set({ connectionError: error, isConnecting: false }),

  reset: () => {
    set(initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crossings_session_token');
    }
  },
}));

// Selectors
export const selectIsHost = (state: RoomStore) => {
  if (!state.room || !state.myPlayerId) return false;
  return state.room.hostId === state.myPlayerId;
};

export const selectMyPlayer = (state: RoomStore) => {
  if (!state.room || !state.myPlayerId) return null;
  return state.room.players.find((p) => p.id === state.myPlayerId) || null;
};

export const selectOtherPlayers = (state: RoomStore) => {
  if (!state.room || !state.myPlayerId) return [];
  return state.room.players.filter((p) => p.id !== state.myPlayerId);
};

export const selectPlayerCount = (state: RoomStore) => {
  return state.room?.players.length ?? 0;
};

export const selectCanStartGame = (state: RoomStore) => {
  const isHost = selectIsHost(state);
  const playerCount = selectPlayerCount(state);
  return isHost && playerCount >= 2 && playerCount <= 6;
};
