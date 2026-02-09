import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/index.js';
import { initializeSocket } from './socket/index.js';
import { cleanupExpiredRooms } from './services/roomService.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (placeholder for future REST endpoints)
app.get('/api', (_req, res) => {
  res.json({
    name: 'Crossings API',
    version: '1.0.0',
  });
});

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Cleanup expired rooms every hour
setInterval(cleanupExpiredRooms, 60 * 60 * 1000);

// Start server
httpServer.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    ✧ CROSSINGS Server Started ✧                          ║
║                                                           ║
║    Port: ${config.port}                                          ║
║    Mode: ${config.nodeEnv}                                  ║
║    CORS: ${config.corsOrigin}                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
