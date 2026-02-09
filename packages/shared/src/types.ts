import { z } from 'zod';

// ============ TYPE CONSTANTS (using const objects for better ESM compatibility) ============

export const Suit = {
  SPADES: 'spades',
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
} as const;
export type Suit = (typeof Suit)[keyof typeof Suit];

export const Rank = {
  ACE: 'A',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
} as const;
export type Rank = (typeof Rank)[keyof typeof Rank];

export const GamePhase = {
  LOBBY: 'lobby',
  DEALING: 'dealing',
  PLAYING: 'playing',
  ACTION_RESOLUTION: 'action_resolution',
  FINAL_RITUAL: 'final_ritual',
  COMPLETED: 'completed',
} as const;
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];

export const PlayerStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  AWAY: 'away',
} as const;
export type PlayerStatus = (typeof PlayerStatus)[keyof typeof PlayerStatus];

export const ActionCardType = {
  REFERRAL: 'referral',
  SHARED_TABLE: 'shared_table',
  TRANSLATOR: 'translator',
  EXPERIMENT: 'experiment',
} as const;
export type ActionCardType = (typeof ActionCardType)[keyof typeof ActionCardType];

// ============ SUIT THEMES ============

export interface SuitTheme {
  name: string;
  subtitle: string;
  color: string;
  accentColor: string;
  symbol: string;
}

export const SUIT_THEMES: Record<Suit, SuitTheme> = {
  spades: {
    name: 'Career Bridge',
    subtitle: 'Vision & Responsibility',
    color: '#1e40af',
    accentColor: '#3b82f6',
    symbol: '♠',
  },
  hearts: {
    name: 'Hospitality Bridge',
    subtitle: 'Oikos & Belonging',
    color: '#dc2626',
    accentColor: '#f87171',
    symbol: '♥',
  },
  diamonds: {
    name: 'Cultural Bridge',
    subtitle: 'Identity & Wisdom',
    color: '#eab308',
    accentColor: '#fde047',
    symbol: '♦',
  },
  clubs: {
    name: 'Wonder Bridge',
    subtitle: 'Science & Faith',
    color: '#16a34a',
    accentColor: '#4ade80',
    symbol: '♣',
  },
};

// ============ CARD MODEL ============

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  prompt: string;
  isActionCard: boolean;
  actionType?: ActionCardType;
  actionDescription?: string;
}

// ============ PLAYER MODEL ============

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isFacilitator: boolean;
  status: PlayerStatus;
  hand: Card[];
  cardsPlayed: number;
  joinedAt: Date;
  lastActiveAt: Date;
}

// ============ ROOM MODEL ============

export interface RoomSettings {
  timerEnabled: boolean;
  timerDurationSeconds: number;
  audioEnabled: boolean;
  facilitatorToolsEnabled: boolean;
  allowSpectators: boolean;
  language: string;
  sessionRecordingConsent: boolean;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  timerEnabled: false,
  timerDurationSeconds: 120,
  audioEnabled: true,
  facilitatorToolsEnabled: true,
  allowSpectators: false,
  language: 'en',
  sessionRecordingConsent: false,
};

export interface Room {
  id: string;
  code: string;
  name?: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  settings: RoomSettings;
  createdAt: Date;
  expiresAt: Date;
}

// ============ GAME STATE MODEL ============

export interface PendingAction {
  type: ActionCardType;
  initiatorId: string;
  targetPlayerId?: string;
  cardToAnswer?: Card;
  awaitingResponses?: string[];
  completedResponses?: string[];
}

export interface GameState {
  roomId: string;
  phase: GamePhase;
  journeyPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  turnOrder: string[];
  turnStartedAt: Date;
  turnEndsAt?: Date;
  currentCard?: Card;
  pendingAction?: PendingAction;
  roundNumber: number;
  totalRounds: number;
  startedAt: Date;
  lastActionAt: Date;
}

// ============ SESSION/HISTORY MODEL ============

export interface SessionPlayer {
  id: string;
  name: string;
  cardsPlayed: number;
  bridgePassesUsed: number;
}

export interface SessionMoment {
  id: string;
  timestamp: Date;
  type: 'card_played' | 'bridge_pass' | 'action_card' | 'shared_answer';
  playerId: string;
  playerName: string;
  card?: Card;
  actionType?: ActionCardType;
  responseSummary?: string;
  isHighlighted: boolean;
  targetPlayerId?: string;
  targetPlayerName?: string;
}

export interface FinalReflection {
  playerId: string;
  playerName: string;
  reflection: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  roomId: string;
  roomCode: string;
  roomName?: string;
  players: SessionPlayer[];
  moments: SessionMoment[];
  highlights: string[];
  finalReflections: FinalReflection[];
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
}

// ============ ZOD VALIDATION SCHEMAS ============

export const PlayerNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(30, 'Name must be 30 characters or less')
  .regex(/^[\p{L}\p{N}\s\-']+$/u, 'Name contains invalid characters');

export const RoomCodeSchema = z
  .string()
  .length(8, 'Room code must be 8 characters')
  .regex(/^[A-Z0-9]+$/, 'Room code must be uppercase alphanumeric');

export const CreateRoomSchema = z.object({
  hostName: PlayerNameSchema,
  roomName: z.string().max(50).optional(),
  settings: z
    .object({
      timerEnabled: z.boolean().optional(),
      timerDurationSeconds: z.number().min(30).max(600).optional(),
      audioEnabled: z.boolean().optional(),
      facilitatorToolsEnabled: z.boolean().optional(),
      allowSpectators: z.boolean().optional(),
    })
    .optional(),
});

export const JoinRoomSchema = z.object({
  roomCode: RoomCodeSchema,
  playerName: PlayerNameSchema,
});

export const PlayCardSchema = z.object({
  roomCode: RoomCodeSchema,
  cardId: z.string().min(1),
});

export const BridgePassSchema = z.object({
  roomCode: RoomCodeSchema,
  reason: z.enum(['pass', 'under_construction']),
});

export const ActionReferralSchema = z.object({
  roomCode: RoomCodeSchema,
  targetPlayerId: z.string().min(1),
  cardId: z.string().min(1),
});

export const ActionExperimentSchema = z.object({
  roomCode: RoomCodeSchema,
  choice: z.enum(['veto', 'challenge']),
  targetPlayerId: z.string().optional(),
});

export const FinalReflectionSchema = z.object({
  roomCode: RoomCodeSchema,
  reflection: z.string().min(1).max(500),
});

// ============ TYPE EXPORTS ============

export type CreateRoomData = z.infer<typeof CreateRoomSchema>;
export type JoinRoomData = z.infer<typeof JoinRoomSchema>;
export type PlayCardData = z.infer<typeof PlayCardSchema>;
export type BridgePassData = z.infer<typeof BridgePassSchema>;
export type ActionReferralData = z.infer<typeof ActionReferralSchema>;
export type ActionExperimentData = z.infer<typeof ActionExperimentSchema>;
export type FinalReflectionData = z.infer<typeof FinalReflectionSchema>;
