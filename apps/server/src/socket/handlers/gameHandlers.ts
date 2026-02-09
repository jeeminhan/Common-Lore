import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@crossings/shared';
import * as roomService from '../../services/roomService.js';
import { config } from '../../config/index.js';

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function registerGameHandlers(io: TypedServer, socket: TypedSocket) {
  // Start game (host only)
  socket.on('game:start', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) {
        socket.emit('room:error', { message: 'Room not found', code: 'ROOM_NOT_FOUND' });
        return;
      }

      // Verify sender is host
      if (room.hostId !== socket.data.playerId) {
        socket.emit('room:error', { message: 'Only host can start game', code: 'NOT_HOST' });
        return;
      }

      const gameState = roomService.startGame(roomCode);
      if (!gameState) {
        socket.emit('room:error', { message: 'Failed to start game', code: 'START_FAILED' });
        return;
      }

      // Send game state with individual hands to each player
      for (const player of room.players) {
        const playerHand = roomService.getPlayerHand(roomCode, player.id);
        const socketId = getSocketIdForPlayer(io, roomCode, player.id);

        if (socketId) {
          io.to(socketId).emit('game:started', {
            gameState: { ...gameState, journeyPile: [] }, // Don't send full journey pile to clients
            yourHand: playerHand,
          });
        }
      }

      // Notify first player it's their turn
      const firstPlayerId = gameState.turnOrder[0];
      const firstPlayer = room.players.find((p) => p.id === firstPlayerId);

      const timerEndsAt = room.settings.timerEnabled
        ? new Date(Date.now() + room.settings.timerDurationSeconds * 1000)
        : undefined;

      io.to(roomCode).emit('game:turn_started', {
        playerId: firstPlayerId,
        playerName: firstPlayer?.name || 'Unknown',
        timerEndsAt,
      });

      console.log(`Game started in room ${roomCode}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start game';
      socket.emit('room:error', { message, code: 'START_FAILED' });
    }
  });

  // Play card
  socket.on('game:play_card', ({ roomCode, cardId }) => {
    try {
      const { playerId, playerName } = socket.data;
      if (!playerId) return;

      const result = roomService.playCard(roomCode, playerId, cardId);
      if (!result) {
        socket.emit('room:error', { message: 'Failed to play card', code: 'PLAY_FAILED' });
        return;
      }

      const { card, gameState } = result;
      const room = roomService.getRoom(roomCode);
      if (!room) return;

      // Broadcast card played to all players
      io.to(roomCode).emit('game:card_played', {
        playerId,
        card,
      });

      // If it's an action card, set up the pending action
      if (card.isActionCard && card.actionType) {
        io.to(roomCode).emit('game:action_card_played', {
          playerId,
          actionType: card.actionType,
          card,
        });

        // Set pending action based on action type
        if (card.actionType === 'shared_table') {
          // All players except the initiator must answer
          const awaitingPlayers = room.players
            .filter(p => p.id !== playerId)
            .map(p => p.id);

          gameState.pendingAction = {
            type: 'shared_table',
            initiatorId: playerId,
            awaitingResponses: awaitingPlayers,
            completedResponses: [],
          };

          // Get the last played question card to answer
          const lastQuestionCard = gameState.discardPile[gameState.discardPile.length - 1];

          io.to(roomCode).emit('game:shared_table_started', {
            card: lastQuestionCard || card,
            awaitingPlayers,
          });
        }
        // Referral, Translator, and Experiment require the player to choose a target
        // so we just notify them to make a choice
      }

      console.log(`${playerName} played ${cardId} in room ${roomCode}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to play card';
      socket.emit('room:error', { message, code: 'PLAY_FAILED' });
    }
  });

  // Answer complete
  socket.on('game:answer_complete', ({ roomCode, highlight }) => {
    try {
      const { playerId } = socket.data;
      if (!playerId) return;

      const room = roomService.getRoom(roomCode);
      const gameState = roomService.completeTurn(roomCode);

      if (!gameState || !room) {
        socket.emit('room:error', { message: 'Failed to complete turn', code: 'TURN_FAILED' });
        return;
      }

      // Notify all players about turn completion
      const nextPlayerId = gameState.turnOrder[gameState.currentPlayerIndex];
      const nextPlayer = room.players.find((p) => p.id === nextPlayerId);

      io.to(roomCode).emit('game:turn_complete', {
        playerId,
        nextPlayerId,
      });

      // Check if game moved to final ritual
      if (gameState.phase === 'final_ritual') {
        io.to(roomCode).emit('game:final_ritual_started');
      } else {
        // Start next turn
        const timerEndsAt = room.settings.timerEnabled
          ? new Date(Date.now() + room.settings.timerDurationSeconds * 1000)
          : undefined;

        io.to(roomCode).emit('game:turn_started', {
          playerId: nextPlayerId,
          playerName: nextPlayer?.name || 'Unknown',
          timerEndsAt,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete turn';
      socket.emit('room:error', { message, code: 'TURN_FAILED' });
    }
  });

  // Bridge pass
  socket.on('game:bridge_pass', ({ roomCode, reason }) => {
    try {
      const { playerId, playerName } = socket.data;
      if (!playerId) return;

      const result = roomService.bridgePass(roomCode, playerId);
      if (!result) {
        socket.emit('room:error', { message: 'Failed to pass', code: 'PASS_FAILED' });
        return;
      }

      const { drawnCard, gameState } = result;
      const room = roomService.getRoom(roomCode);

      // Send drawn card to the player (privately)
      if (drawnCard) {
        socket.emit('game:you_drew_card', { card: drawnCard });
        // Notify others that a card was drawn (without revealing the card)
        socket.to(roomCode).emit('game:card_dealt', { playerId });
      }

      // Notify about the pass
      io.to(roomCode).emit('game:bridge_pass', { playerId, reason });

      // Start next turn
      const nextPlayerId = gameState.turnOrder[gameState.currentPlayerIndex];
      const nextPlayer = room?.players.find((p) => p.id === nextPlayerId);

      const timerEndsAt = room?.settings.timerEnabled
        ? new Date(Date.now() + (room.settings.timerDurationSeconds || config.defaultTimerSeconds) * 1000)
        : undefined;

      io.to(roomCode).emit('game:turn_started', {
        playerId: nextPlayerId,
        playerName: nextPlayer?.name || 'Unknown',
        timerEndsAt,
      });

      console.log(`${playerName} passed (${reason}) in room ${roomCode}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to pass';
      socket.emit('room:error', { message, code: 'PASS_FAILED' });
    }
  });

  // Action card: Referral
  socket.on('game:action_referral', ({ roomCode, targetPlayerId, cardId }) => {
    try {
      const room = roomService.getRoom(roomCode);
      const game = roomService.getGameState(roomCode);
      if (!room || !game) return;

      const targetPlayer = room.players.find((p) => p.id === targetPlayerId);
      if (!targetPlayer) return;

      // Get the card from the initiator's hand (the question card to refer)
      const initiator = room.players.find((p) => p.id === socket.data.playerId);
      const card = initiator?.hand.find((c) => c.id === cardId);

      if (card) {
        // Set pending action so target must answer
        game.pendingAction = {
          type: 'referral',
          initiatorId: socket.data.playerId!,
          targetPlayerId,
          cardToAnswer: card,
        };

        io.to(roomCode).emit('game:referral_target', {
          targetPlayerId,
          targetPlayerName: targetPlayer.name,
          card,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to execute referral';
      socket.emit('room:error', { message, code: 'REFERRAL_FAILED' });
    }
  });

  // Action card: Shared Table complete
  socket.on('game:action_shared_table_complete', ({ roomCode }) => {
    try {
      const { playerId } = socket.data;
      if (!playerId) return;

      const room = roomService.getRoom(roomCode);
      const game = roomService.getGameState(roomCode);
      if (!room || !game) return;

      // Track response completion
      if (game.pendingAction && game.pendingAction.type === 'shared_table') {
        if (!game.pendingAction.completedResponses) {
          game.pendingAction.completedResponses = [];
        }
        if (!game.pendingAction.completedResponses.includes(playerId)) {
          game.pendingAction.completedResponses.push(playerId);
        }

        io.to(roomCode).emit('game:shared_table_response', { playerId });

        // Check if all players have responded
        const awaitingCount = game.pendingAction.awaitingResponses?.length || 0;
        const completedCount = game.pendingAction.completedResponses.length;

        if (completedCount >= awaitingCount) {
          // All players responded, clear pending action and complete turn
          game.pendingAction = undefined;

          const gameState = roomService.completeTurn(roomCode);
          if (gameState) {
            const nextPlayerId = gameState.turnOrder[gameState.currentPlayerIndex];
            const nextPlayer = room.players.find((p) => p.id === nextPlayerId);

            io.to(roomCode).emit('game:turn_complete', {
              playerId: game.turnOrder[game.currentPlayerIndex],
              nextPlayerId,
            });

            const timerEndsAt = room.settings.timerEnabled
              ? new Date(Date.now() + room.settings.timerDurationSeconds * 1000)
              : undefined;

            io.to(roomCode).emit('game:turn_started', {
              playerId: nextPlayerId,
              playerName: nextPlayer?.name || 'Unknown',
              timerEndsAt,
            });
          }
        }
      } else {
        io.to(roomCode).emit('game:shared_table_response', { playerId });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete shared table response';
      socket.emit('room:error', { message, code: 'SHARED_TABLE_FAILED' });
    }
  });

  // Action card: Translator (player asked to explain using metaphor/native language)
  socket.on('game:action_translator_complete', ({ roomCode }) => {
    try {
      const { playerId } = socket.data;
      if (!playerId) return;

      const room = roomService.getRoom(roomCode);
      const game = roomService.getGameState(roomCode);
      if (!room || !game) return;

      // Clear pending action
      if (game.pendingAction && game.pendingAction.type === 'translator') {
        game.pendingAction = undefined;
      }

      // Complete the turn
      const gameState = roomService.completeTurn(roomCode);
      if (gameState) {
        const nextPlayerId = gameState.turnOrder[gameState.currentPlayerIndex];
        const nextPlayer = room.players.find((p) => p.id === nextPlayerId);

        io.to(roomCode).emit('game:turn_complete', {
          playerId,
          nextPlayerId,
        });

        if (gameState.phase === 'final_ritual') {
          io.to(roomCode).emit('game:final_ritual_started');
        } else {
          const timerEndsAt = room.settings.timerEnabled
            ? new Date(Date.now() + room.settings.timerDurationSeconds * 1000)
            : undefined;

          io.to(roomCode).emit('game:turn_started', {
            playerId: nextPlayerId,
            playerName: nextPlayer?.name || 'Unknown',
            timerEndsAt,
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete translator response';
      socket.emit('room:error', { message, code: 'TRANSLATOR_FAILED' });
    }
  });

  // Action card: Experiment
  socket.on('game:action_experiment', ({ roomCode, choice, targetPlayerId }) => {
    try {
      const { playerId } = socket.data;
      if (!playerId) return;

      if (choice === 'veto') {
        // Draw a new card
        const result = roomService.bridgePass(roomCode, playerId);
        if (result?.drawnCard) {
          socket.emit('game:you_drew_card', { card: result.drawnCard });
        }
      }

      io.to(roomCode).emit('game:experiment_choice', {
        choice,
        targetPlayerId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to execute experiment';
      socket.emit('room:error', { message, code: 'EXPERIMENT_FAILED' });
    }
  });

  // Final reflection
  socket.on('game:final_reflection', ({ roomCode, reflection }) => {
    try {
      const { playerId, playerName } = socket.data;
      if (!playerId || !playerName) return;

      io.to(roomCode).emit('game:reflection_shared', {
        playerId,
        playerName,
        reflection,
      });

      // Check if all players have shared
      // In a full implementation, track this in game state
      console.log(`${playerName} shared reflection in room ${roomCode}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to share reflection';
      socket.emit('room:error', { message, code: 'REFLECTION_FAILED' });
    }
  });

  // Facilitator controls
  socket.on('facilitator:pause', ({ roomCode }) => {
    const { playerId } = socket.data;
    if (!playerId) return;

    const room = roomService.getRoom(roomCode);
    if (room?.hostId === playerId) {
      io.to(roomCode).emit('game:paused', { byPlayerId: playerId });
    }
  });

  socket.on('facilitator:resume', ({ roomCode }) => {
    const { playerId } = socket.data;
    if (!playerId) return;

    const room = roomService.getRoom(roomCode);
    if (room?.hostId === playerId) {
      io.to(roomCode).emit('game:resumed', { byPlayerId: playerId });
    }
  });

  socket.on('facilitator:skip_turn', ({ roomCode }) => {
    const { playerId } = socket.data;
    if (!playerId) return;

    const room = roomService.getRoom(roomCode);
    const game = roomService.getGameState(roomCode);

    if (room?.hostId === playerId && game) {
      const skippedPlayerId = game.turnOrder[game.currentPlayerIndex];

      // Complete the turn
      const newGameState = roomService.completeTurn(roomCode);
      if (newGameState) {
        io.to(roomCode).emit('game:turn_skipped', { skippedPlayerId });

        const nextPlayerId = newGameState.turnOrder[newGameState.currentPlayerIndex];
        const nextPlayer = room.players.find((p) => p.id === nextPlayerId);

        io.to(roomCode).emit('game:turn_started', {
          playerId: nextPlayerId,
          playerName: nextPlayer?.name || 'Unknown',
        });
      }
    }
  });
}

// Helper to find socket ID for a player
function getSocketIdForPlayer(
  io: TypedServer,
  roomCode: string,
  playerId: string
): string | null {
  const sockets = io.sockets.adapter.rooms.get(roomCode);
  if (!sockets) return null;

  for (const socketId of sockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket?.data.playerId === playerId) {
      return socketId;
    }
  }
  return null;
}
