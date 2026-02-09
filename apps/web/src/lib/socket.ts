import { io, Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  ActionCardType,
  PlayerStatus,
} from '@crossings/shared';
import { useRoomStore } from '@/stores/roomStore';
import { useGameStore } from '@/stores/gameStore';
import { useSessionStore } from '@/stores/sessionStore';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;
let listenersRegistered = false;

function setupListeners(s: TypedSocket) {
  if (listenersRegistered) return;
  listenersRegistered = true;

  const roomStore = useRoomStore;
  const gameStore = useGameStore;
  const sessionStore = useSessionStore;

  // Connection events
  s.on('connect', () => {
    console.log('Socket connected');
    roomStore.getState().setConnected(true);
  });

  s.on('disconnect', () => {
    console.log('Socket disconnected');
    roomStore.getState().setConnected(false);
  });

  // Room events
  s.on('room:created', ({ room, playerId }) => {
    console.log('room:created received', { room, playerId });
    roomStore.getState().setRoom(room);
    roomStore.getState().setMyPlayerId(playerId);
  });

  s.on('room:joined', ({ room, playerId }) => {
    console.log('room:joined received', { room, playerId });
    roomStore.getState().setRoom(room);
    roomStore.getState().setMyPlayerId(playerId);
  });

  s.on('room:player_joined', ({ player }) => {
    roomStore.getState().addPlayer(player);
  });

  s.on('room:player_left', ({ playerId }) => {
    roomStore.getState().removePlayer(playerId);
  });

  s.on('room:settings_updated', ({ settings }) => {
    roomStore.getState().updateSettings(settings);
  });

  s.on('room:error', ({ message, code }) => {
    console.log('room:error received', { message, code });
    // Only set connectionError for fatal errors (room not found, etc.)
    // Game action errors (not your turn, etc.) are just logged
    const fatalCodes = ['ROOM_NOT_FOUND', 'CREATE_FAILED', 'JOIN_FAILED'];
    if (fatalCodes.includes(code)) {
      roomStore.getState().setConnectionError(`${code}: ${message}`);
    } else {
      // Just log non-fatal errors for now
      console.warn(`Game error: ${code} - ${message}`);
    }
  });

  // Game events
  s.on('game:started', ({ gameState, yourHand }) => {
    gameStore.getState().setGameState(gameState);
    gameStore.getState().setMyHand(yourHand);
  });

  s.on('game:state_update', ({ gameState }) => {
    gameStore.getState().updateGameState(gameState);
  });

  s.on('game:you_drew_card', ({ card }) => {
    gameStore.getState().addToHand(card);
  });

  s.on('game:turn_started', ({ timerEndsAt }) => {
    if (timerEndsAt) {
      const endsAt = new Date(timerEndsAt);
      const seconds = Math.floor((endsAt.getTime() - Date.now()) / 1000);
      gameStore.getState().setTimer(seconds, endsAt);
    }
  });

  s.on('game:card_played', ({ playerId, card }) => {
    console.log('game:card_played received', { playerId, card });
    gameStore.getState().setCurrentQuestion(card);
    const myId = roomStore.getState().myPlayerId;
    console.log('myId:', myId, 'playerId:', playerId);
    if (playerId === myId) {
      gameStore.getState().removeFromHand(card.id);
      gameStore.getState().setIsAnswering(true);
    }
  });

  s.on('game:bridge_pass', () => {
    // UI update handled by state
  });

  s.on('game:turn_complete', () => {
    gameStore.getState().setIsAnswering(false);
    gameStore.getState().setCurrentQuestion(null);
  });

  // Action card events
  s.on('game:action_card_played', ({ playerId, actionType }) => {
    gameStore.getState().setPendingAction({
      type: actionType,
      initiatorId: playerId,
    });
  });

  s.on('game:shared_table_started', ({ card, awaitingPlayers }) => {
    gameStore.getState().setCurrentQuestion(card);
    gameStore.getState().setPendingAction({
      type: 'shared_table' as ActionCardType,
      initiatorId: roomStore.getState().myPlayerId || '',
      awaitingResponses: awaitingPlayers,
      completedResponses: [],
    });
  });

  s.on('game:referral_target', ({ targetPlayerId, card }) => {
    const myId = roomStore.getState().myPlayerId;
    gameStore.getState().setCurrentQuestion(card);
    gameStore.getState().setPendingAction({
      type: 'referral' as ActionCardType,
      initiatorId: '',
      targetPlayerId,
      cardToAnswer: card,
    });
    // If I'm the target, I need to answer
    if (targetPlayerId === myId) {
      gameStore.getState().setIsAnswering(true);
    }
  });

  s.on('game:translator_target', ({ targetPlayerId }) => {
    const myId = roomStore.getState().myPlayerId;
    gameStore.getState().setPendingAction({
      type: 'translator' as ActionCardType,
      initiatorId: '',
      targetPlayerId,
    });
    // If I'm the target, I need to respond with metaphor/native language
    if (targetPlayerId === myId) {
      gameStore.getState().setIsAnswering(true);
    }
  });

  // Timer events
  s.on('game:timer_tick', ({ secondsRemaining }) => {
    gameStore.getState().setTimer(secondsRemaining, null);
  });

  // End game events
  s.on('game:completed', ({ session }) => {
    sessionStore.getState().setSession(session);
  });

  s.on('game:reflection_shared', ({ playerId, playerName, reflection }) => {
    sessionStore.getState().addReflection({
      playerId,
      playerName,
      reflection,
      timestamp: new Date(),
    });
  });

  // Presence events
  s.on('presence:player_disconnected', ({ playerId }) => {
    roomStore.getState().updatePlayerStatus(playerId, 'disconnected' as PlayerStatus);
  });

  s.on('presence:player_reconnected', ({ playerId }) => {
    roomStore.getState().updatePlayerStatus(playerId, 'connected' as PlayerStatus);
  });
}

export function getSocket(): TypedSocket {
  if (!socket) {
    const serverUrl =
      (import.meta as { env?: { VITE_SERVER_URL?: string } }).env?.VITE_SERVER_URL || 'http://localhost:3001';

    socket = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });

    // Set up listeners when socket is created
    setupListeners(socket);
  }
  return socket;
}

export function connectSocket(sessionToken?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = getSocket();

    if (s.connected) {
      resolve();
      return;
    }

    // Add auth token if available
    if (sessionToken) {
      s.auth = { sessionToken };
    }

    const onConnect = () => {
      s.off('connect', onConnect);
      s.off('connect_error', onError);
      resolve();
    };

    const onError = (err: Error) => {
      s.off('connect', onConnect);
      s.off('connect_error', onError);
      reject(err);
    };

    s.on('connect', onConnect);
    s.on('connect_error', onError);

    s.connect();
  });
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    listenersRegistered = false;
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
