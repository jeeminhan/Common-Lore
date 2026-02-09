import type {
  Card,
  Room,
  Player,
  GameState,
  Session,
  RoomSettings,
  ActionCardType,
  CreateRoomData,
  JoinRoomData,
} from './types';

// ============ CLIENT -> SERVER EVENTS ============

export interface ClientToServerEvents {
  // Room Management
  'room:create': (data: CreateRoomData) => void;
  'room:join': (data: JoinRoomData) => void;
  'room:leave': (data: { roomCode: string }) => void;
  'room:kick': (data: { roomCode: string; playerId: string }) => void;
  'room:settings': (data: {
    roomCode: string;
    settings: Partial<RoomSettings>;
  }) => void;

  // Game Flow
  'game:start': (data: { roomCode: string }) => void;
  'game:play_card': (data: { roomCode: string; cardId: string }) => void;
  'game:bridge_pass': (data: {
    roomCode: string;
    reason: 'pass' | 'under_construction';
  }) => void;
  'game:answer_complete': (data: {
    roomCode: string;
    highlight?: boolean;
  }) => void;

  // Action Cards
  'game:action_referral': (data: {
    roomCode: string;
    targetPlayerId: string;
    cardId: string;
  }) => void;
  'game:action_shared_table_complete': (data: { roomCode: string }) => void;
  'game:action_translator_complete': (data: { roomCode: string }) => void;
  'game:action_experiment': (data: {
    roomCode: string;
    choice: 'veto' | 'challenge';
    targetPlayerId?: string;
  }) => void;

  // Final Ritual
  'game:final_reflection': (data: {
    roomCode: string;
    reflection: string;
  }) => void;

  // Session
  'session:highlight_moment': (data: {
    roomCode: string;
    momentId: string;
  }) => void;
  'session:add_note': (data: {
    roomCode: string;
    momentId: string;
    note: string;
  }) => void;

  // Facilitator
  'facilitator:pause': (data: { roomCode: string }) => void;
  'facilitator:resume': (data: { roomCode: string }) => void;
  'facilitator:skip_turn': (data: { roomCode: string }) => void;
  'facilitator:extend_timer': (data: {
    roomCode: string;
    seconds: number;
  }) => void;

  // Presence
  'presence:typing': (data: { roomCode: string }) => void;
  'presence:away': (data: { roomCode: string }) => void;
  'presence:back': (data: { roomCode: string }) => void;
}

// ============ SERVER -> CLIENT EVENTS ============

export interface ServerToClientEvents {
  // Room Events
  'room:created': (data: { room: Room; playerId: string }) => void;
  'room:joined': (data: { room: Room; playerId: string }) => void;
  'room:player_joined': (data: { player: Player }) => void;
  'room:player_left': (data: {
    playerId: string;
    playerName: string;
  }) => void;
  'room:settings_updated': (data: { settings: RoomSettings }) => void;
  'room:error': (data: { message: string; code: string }) => void;

  // Game State Events
  'game:started': (data: { gameState: GameState; yourHand: Card[] }) => void;
  'game:state_update': (data: { gameState: Partial<GameState> }) => void;
  'game:card_dealt': (data: { playerId: string }) => void;
  'game:you_drew_card': (data: { card: Card }) => void;

  // Turn Events
  'game:turn_started': (data: {
    playerId: string;
    playerName: string;
    timerEndsAt?: Date;
  }) => void;
  'game:card_played': (data: { playerId: string; card: Card }) => void;
  'game:bridge_pass': (data: { playerId: string; reason: string }) => void;
  'game:turn_complete': (data: {
    playerId: string;
    nextPlayerId: string;
  }) => void;

  // Action Card Events
  'game:action_card_played': (data: {
    playerId: string;
    actionType: ActionCardType;
    card: Card;
  }) => void;
  'game:referral_target': (data: {
    targetPlayerId: string;
    targetPlayerName: string;
    card: Card;
  }) => void;
  'game:shared_table_started': (data: {
    card: Card;
    awaitingPlayers: string[];
  }) => void;
  'game:shared_table_response': (data: { playerId: string }) => void;
  'game:translator_target': (data: {
    targetPlayerId: string;
    targetPlayerName: string;
  }) => void;
  'game:experiment_choice': (data: {
    choice: 'veto' | 'challenge';
    targetPlayerId?: string;
  }) => void;

  // Timer Events
  'game:timer_tick': (data: { secondsRemaining: number }) => void;
  'game:timer_warning': (data: { secondsRemaining: number }) => void;
  'game:timer_expired': (data: { playerId: string }) => void;

  // End Game Events
  'game:final_ritual_started': () => void;
  'game:reflection_shared': (data: {
    playerId: string;
    playerName: string;
    reflection: string;
  }) => void;
  'game:completed': (data: { session: Session }) => void;

  // Session Events
  'session:moment_highlighted': (data: {
    momentId: string;
    byPlayerId: string;
  }) => void;
  'session:saved': (data: { sessionId: string }) => void;

  // Facilitator Events
  'game:paused': (data: { byPlayerId: string }) => void;
  'game:resumed': (data: { byPlayerId: string }) => void;
  'game:turn_skipped': (data: { skippedPlayerId: string }) => void;

  // Presence Events
  'presence:player_typing': (data: { playerId: string }) => void;
  'presence:player_away': (data: { playerId: string }) => void;
  'presence:player_back': (data: { playerId: string }) => void;
  'presence:player_disconnected': (data: { playerId: string }) => void;
  'presence:player_reconnected': (data: { playerId: string }) => void;
}

// ============ INTER-SERVER EVENTS (for scaling) ============

export interface InterServerEvents {
  ping: () => void;
}

// ============ SOCKET DATA ============

export interface SocketData {
  playerId: string;
  playerName: string;
  roomCode?: string;
  sessionToken: string;
}
