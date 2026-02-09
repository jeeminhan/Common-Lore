import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useRoomStore, selectIsHost, selectCanStartGame } from '@/stores/roomStore';
import { useGameStore } from '@/stores/gameStore';
import GameBoard from '@/components/game/GameBoard';
import Button from '@/components/ui/Button';
import { GamePhase } from '@crossings/shared';

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { connect, emit, isConnected, connectionError } = useSocket();

  const room = useRoomStore((state) => state.room);
  const isHost = useRoomStore(selectIsHost);
  const canStartGame = useRoomStore(selectCanStartGame);
  const gameState = useGameStore((state) => state.gameState);

  // Connect on mount if not connected
  useEffect(() => {
    if (!isConnected && roomCode) {
      // Try to reconnect with stored session token
      const sessionToken = localStorage.getItem('crossings_session_token');
      connect(sessionToken || undefined);
    }
  }, [isConnected, roomCode, connect]);

  // If no room data and connected, redirect to join
  useEffect(() => {
    if (isConnected && !room && roomCode) {
      navigate(`/join/${roomCode}`);
    }
  }, [isConnected, room, roomCode, navigate]);

  const handleStartGame = () => {
    if (roomCode) {
      emit.startGame(roomCode);
    }
  };

  const handleCopyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
    }
  };

  // Loading state
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal mx-auto mb-4" />
          <p className="text-gray-400">Connecting to room...</p>
        </div>
      </div>
    );
  }

  // Connection error
  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-hearts text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{connectionError}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Game in progress - show game board
  if (gameState && gameState.phase !== GamePhase.LOBBY) {
    return <GameBoard roomCode={room.code} />;
  }

  // Lobby - waiting room
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Room header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {room.name || 'Game Room'}
          </h1>

          {/* Room code */}
          <div className="inline-flex items-center gap-2 bg-navy-800 px-4 py-2 rounded-lg border border-navy-700">
            <span className="text-gray-400 text-sm">Room Code:</span>
            <span className="font-mono text-xl text-teal tracking-wider">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="text-gray-400 hover:text-white transition-colors ml-2"
              title="Copy code"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Players list */}
        <div className="bg-navy-800 rounded-2xl p-6 mb-6 border border-navy-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Players ({room.players.length}/6)
          </h2>

          <div className="space-y-3">
            {room.players.map((player) => (
              <motion.div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-navy-900 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-lg font-bold">
                  {player.avatar || player.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <span className="text-white font-medium">{player.name}</span>
                  {player.isHost && (
                    <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                      Host
                    </span>
                  )}
                </div>

                {/* Status indicator */}
                <div
                  className={`w-3 h-3 rounded-full ${
                    player.status === 'connected'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                  }`}
                />
              </motion.div>
            ))}

            {/* Empty slots */}
            {[...Array(6 - room.players.length)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 p-3 border-2 border-dashed border-navy-700 rounded-lg opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center">
                  <span className="text-gray-600">?</span>
                </div>
                <span className="text-gray-600">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start game button (host only) */}
        {isHost && (
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
              disabled={!canStartGame}
            >
              Start Game
            </Button>
            {room.players.length < 2 && (
              <p className="text-gray-500 text-sm mt-2">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}

        {/* Waiting message (non-host) */}
        {!isHost && (
          <div className="text-center">
            <p className="text-gray-400">
              Waiting for the host to start the game...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
