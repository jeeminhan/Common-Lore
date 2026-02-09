import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@crossings/shared';
import { config } from '../config/index.js';
import { registerRoomHandlers } from './handlers/roomHandlers.js';
import { registerGameHandlers } from './handlers/gameHandlers.js';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware for authentication (optional)
  io.use((socket, next) => {
    const sessionToken = socket.handshake.auth.sessionToken as string | undefined;

    if (sessionToken) {
      // Could validate session token and restore session data
      socket.data.sessionToken = sessionToken;
    }

    next();
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Register event handlers
    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}
