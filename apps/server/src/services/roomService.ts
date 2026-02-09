import { nanoid, customAlphabet } from 'nanoid';
import type {
  Room,
  Player,
  RoomSettings,
  PlayerStatus,
  GameState,
  GamePhase,
  Card,
} from '@crossings/shared';
import { DEFAULT_ROOM_SETTINGS } from '@crossings/shared';
import { config } from '../config/index.js';
import { createDeck, shuffleDeck, dealCards } from './deckService.js';

// Generate room codes: uppercase alphanumeric
const generateRoomCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', config.roomCodeLength);

// In-memory storage (replace with Redis in production)
const rooms = new Map<string, Room>();
const games = new Map<string, GameState>();
const playerSessions = new Map<string, { roomCode: string; playerId: string }>();

export function createRoom(
  hostName: string,
  hostSocketId: string,
  roomName?: string,
  settings?: Partial<RoomSettings>
): { room: Room; sessionToken: string } {
  // Generate unique room code with collision check
  let code: string;
  let attempts = 0;
  do {
    code = generateRoomCode();
    attempts++;
    if (attempts > 10) {
      throw new Error('Failed to generate unique room code');
    }
  } while (rooms.has(code));

  const roomId = nanoid();
  const playerId = nanoid();
  const sessionToken = nanoid(32);

  const host: Player = {
    id: playerId,
    name: hostName,
    isHost: true,
    isFacilitator: true,
    status: 'connected' as PlayerStatus,
    hand: [],
    cardsPlayed: 0,
    joinedAt: new Date(),
    lastActiveAt: new Date(),
  };

  const room: Room = {
    id: roomId,
    code,
    name: roomName,
    hostId: playerId,
    players: [host],
    maxPlayers: config.maxPlayersPerRoom,
    settings: { ...DEFAULT_ROOM_SETTINGS, ...settings },
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + config.roomExpirationHours * 60 * 60 * 1000),
  };

  rooms.set(code, room);
  playerSessions.set(sessionToken, { roomCode: code, playerId });

  // Map socket ID to session for reconnection
  playerSessions.set(hostSocketId, { roomCode: code, playerId });

  return { room, sessionToken };
}

export function joinRoom(
  roomCode: string,
  playerName: string,
  socketId: string
): { room: Room; playerId: string; sessionToken: string } | null {
  const room = rooms.get(roomCode);
  if (!room) return null;

  // Check if game already started
  const game = games.get(roomCode);
  if (game && game.phase !== 'lobby') {
    throw new Error('Game has already started');
  }

  // Check max players
  if (room.players.length >= room.maxPlayers) {
    throw new Error('Room is full');
  }

  // Check for duplicate names
  if (room.players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())) {
    throw new Error('A player with that name is already in the room');
  }

  const playerId = nanoid();
  const sessionToken = nanoid(32);

  const player: Player = {
    id: playerId,
    name: playerName,
    isHost: false,
    isFacilitator: false,
    status: 'connected' as PlayerStatus,
    hand: [],
    cardsPlayed: 0,
    joinedAt: new Date(),
    lastActiveAt: new Date(),
  };

  room.players.push(player);
  playerSessions.set(sessionToken, { roomCode, playerId });
  playerSessions.set(socketId, { roomCode, playerId });

  return { room, playerId, sessionToken };
}

export function getRoom(roomCode: string): Room | undefined {
  return rooms.get(roomCode);
}

export function getGameState(roomCode: string): GameState | undefined {
  return games.get(roomCode);
}

export function removePlayer(roomCode: string, playerId: string): Room | null {
  const room = rooms.get(roomCode);
  if (!room) return null;

  room.players = room.players.filter((p) => p.id !== playerId);

  // If no players left, delete room
  if (room.players.length === 0) {
    rooms.delete(roomCode);
    games.delete(roomCode);
    return null;
  }

  // If host left, assign new host
  if (room.hostId === playerId) {
    const newHost = room.players[0];
    newHost.isHost = true;
    newHost.isFacilitator = true;
    room.hostId = newHost.id;
  }

  return room;
}

export function updatePlayerStatus(
  roomCode: string,
  playerId: string,
  status: PlayerStatus
): void {
  const room = rooms.get(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.status = status;
    player.lastActiveAt = new Date();
  }
}

export function startGame(roomCode: string): GameState | null {
  const room = rooms.get(roomCode);
  if (!room) return null;

  if (room.players.length < config.minPlayersToStart) {
    throw new Error(`Need at least ${config.minPlayersToStart} players to start`);
  }

  // Create and shuffle deck
  const deck = createDeck();
  const shuffledDeck = shuffleDeck(deck);

  // Deal cards
  const { hands, remaining } = dealCards(
    shuffledDeck,
    room.players.length,
    config.cardsPerPlayer
  );

  // Assign hands to players
  room.players.forEach((player, index) => {
    player.hand = hands[index];
  });

  // Create turn order
  const turnOrder = room.players.map((p) => p.id);

  const gameState: GameState = {
    roomId: room.id,
    phase: 'playing' as GamePhase,
    journeyPile: remaining,
    discardPile: [],
    currentPlayerIndex: 0,
    turnOrder,
    turnStartedAt: new Date(),
    roundNumber: 1,
    totalRounds: config.cardsPerPlayer,
    startedAt: new Date(),
    lastActionAt: new Date(),
  };

  games.set(roomCode, gameState);

  return gameState;
}

export function playCard(
  roomCode: string,
  playerId: string,
  cardId: string
): { card: Card; gameState: GameState } | null {
  const room = rooms.get(roomCode);
  const game = games.get(roomCode);
  if (!room || !game) return null;

  // Verify it's the player's turn
  const currentPlayerId = game.turnOrder[game.currentPlayerIndex];
  if (currentPlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  // Find player and card
  const player = room.players.find((p) => p.id === playerId);
  if (!player) return null;

  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    throw new Error("Card not in hand");
  }

  // Remove card from hand
  const [card] = player.hand.splice(cardIndex, 1);
  player.cardsPlayed++;

  // Update game state
  game.currentCard = card;
  game.lastActionAt = new Date();

  return { card, gameState: game };
}

export function completeTurn(roomCode: string): GameState | null {
  const room = rooms.get(roomCode);
  const game = games.get(roomCode);
  if (!room || !game) return null;

  // Move current card to discard pile
  if (game.currentCard) {
    game.discardPile.push(game.currentCard);
    game.currentCard = undefined;
  }

  // Move to next player
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.turnOrder.length;
  game.turnStartedAt = new Date();
  game.lastActionAt = new Date();

  // Check if round complete (all players have played)
  const allPlayersPlayedThisRound = room.players.every(
    (p) => p.cardsPlayed >= game.roundNumber
  );

  if (allPlayersPlayedThisRound) {
    game.roundNumber++;

    // Check if game is complete
    const allCardsPlayed = room.players.every((p) => p.hand.length === 0);
    if (allCardsPlayed) {
      game.phase = 'final_ritual' as GamePhase;
    }
  }

  return game;
}

export function bridgePass(
  roomCode: string,
  playerId: string
): { drawnCard: Card | null; gameState: GameState } | null {
  const room = rooms.get(roomCode);
  const game = games.get(roomCode);
  if (!room || !game) return null;

  // Verify it's the player's turn
  const currentPlayerId = game.turnOrder[game.currentPlayerIndex];
  if (currentPlayerId !== playerId) {
    throw new Error("Not your turn");
  }

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return null;

  // Draw a card from journey pile
  let drawnCard: Card | null = null;
  if (game.journeyPile.length > 0) {
    drawnCard = game.journeyPile.shift()!;
    player.hand.push(drawnCard);
  }

  // Move to next player
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.turnOrder.length;
  game.turnStartedAt = new Date();
  game.lastActionAt = new Date();

  return { drawnCard, gameState: game };
}

export function getPlayerBySession(sessionToken: string): { roomCode: string; playerId: string } | null {
  return playerSessions.get(sessionToken) || null;
}

export function getPlayerHand(roomCode: string, playerId: string): Card[] {
  const room = rooms.get(roomCode);
  if (!room) return [];

  const player = room.players.find((p) => p.id === playerId);
  return player?.hand || [];
}

// Cleanup expired rooms (call periodically)
export function cleanupExpiredRooms(): void {
  const now = new Date();
  for (const [code, room] of rooms) {
    if (room.expiresAt < now) {
      rooms.delete(code);
      games.delete(code);
    }
  }
}
