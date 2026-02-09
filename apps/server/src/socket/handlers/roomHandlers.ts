import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@crossings/shared';
import {
  CreateRoomSchema,
  JoinRoomSchema,
  PlayerNameSchema,
} from '@crossings/shared';
import * as roomService from '../../services/roomService.js';

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

export function registerRoomHandlers(io: TypedServer, socket: TypedSocket) {
  // Create room
  socket.on('room:create', (data) => {
    try {
      // Validate input
      const validated = CreateRoomSchema.parse(data);

      const { room, sessionToken } = roomService.createRoom(
        validated.hostName,
        socket.id,
        validated.roomName,
        validated.settings
      );

      // Store session data on socket
      socket.data.playerId = room.hostId;
      socket.data.playerName = validated.hostName;
      socket.data.roomCode = room.code;
      socket.data.sessionToken = sessionToken;

      // Join socket room
      socket.join(room.code);

      // Emit success
      socket.emit('room:created', { room, playerId: room.hostId });

      console.log(`Room ${room.code} created by ${validated.hostName}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create room';
      socket.emit('room:error', { message, code: 'CREATE_FAILED' });
    }
  });

  // Join room
  socket.on('room:join', (data) => {
    try {
      // Validate input
      const validated = JoinRoomSchema.parse(data);

      const result = roomService.joinRoom(
        validated.roomCode,
        validated.playerName,
        socket.id
      );

      if (!result) {
        socket.emit('room:error', { message: 'Room not found', code: 'ROOM_NOT_FOUND' });
        return;
      }

      const { room, playerId, sessionToken } = result;

      // Store session data on socket
      socket.data.playerId = playerId;
      socket.data.playerName = validated.playerName;
      socket.data.roomCode = room.code;
      socket.data.sessionToken = sessionToken;

      // Join socket room
      socket.join(room.code);

      // Emit to the new player
      socket.emit('room:joined', { room, playerId });

      // Emit to other players in the room
      const newPlayer = room.players.find((p) => p.id === playerId);
      if (newPlayer) {
        socket.to(room.code).emit('room:player_joined', { player: newPlayer });
      }

      console.log(`${validated.playerName} joined room ${room.code}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join room';
      socket.emit('room:error', { message, code: 'JOIN_FAILED' });
    }
  });

  // Leave room
  socket.on('room:leave', ({ roomCode }) => {
    handlePlayerLeave(io, socket, roomCode);
  });

  // Kick player (host only)
  socket.on('room:kick', ({ roomCode, playerId }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) return;

      // Verify sender is host
      if (room.hostId !== socket.data.playerId) {
        socket.emit('room:error', { message: 'Only host can kick players', code: 'NOT_HOST' });
        return;
      }

      // Can't kick yourself
      if (playerId === socket.data.playerId) {
        socket.emit('room:error', { message: "Can't kick yourself", code: 'SELF_KICK' });
        return;
      }

      const kickedPlayer = room.players.find((p) => p.id === playerId);
      if (!kickedPlayer) return;

      const updatedRoom = roomService.removePlayer(roomCode, playerId);
      if (updatedRoom) {
        io.to(roomCode).emit('room:player_left', {
          playerId,
          playerName: kickedPlayer.name,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to kick player';
      socket.emit('room:error', { message, code: 'KICK_FAILED' });
    }
  });

  // Update room settings (host only)
  socket.on('room:settings', ({ roomCode, settings }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) return;

      // Verify sender is host
      if (room.hostId !== socket.data.playerId) {
        socket.emit('room:error', { message: 'Only host can change settings', code: 'NOT_HOST' });
        return;
      }

      // Update settings
      Object.assign(room.settings, settings);

      // Broadcast to all players
      io.to(roomCode).emit('room:settings_updated', { settings: room.settings });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      socket.emit('room:error', { message, code: 'SETTINGS_FAILED' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const { roomCode, playerId, playerName } = socket.data;
    if (roomCode && playerId) {
      // Mark as disconnected instead of removing (allow reconnection)
      roomService.updatePlayerStatus(roomCode, playerId, 'disconnected');
      io.to(roomCode).emit('presence:player_disconnected', { playerId });

      console.log(`${playerName} disconnected from room ${roomCode}`);
    }
  });
}

function handlePlayerLeave(
  io: TypedServer,
  socket: TypedSocket,
  roomCode: string
) {
  const { playerId, playerName } = socket.data;
  if (!playerId) return;

  const room = roomService.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return;

  const updatedRoom = roomService.removePlayer(roomCode, playerId);

  // Leave socket room
  socket.leave(roomCode);

  // Clear socket data
  socket.data.roomCode = undefined;

  if (updatedRoom) {
    io.to(roomCode).emit('room:player_left', {
      playerId,
      playerName: player.name,
    });
  }

  console.log(`${playerName} left room ${roomCode}`);
}
