import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useRoomStore } from '@/stores/roomStore';
import Button from '@/components/ui/Button';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { roomCode: urlRoomCode } = useParams<{ roomCode?: string }>();
  const { connect, emit, isConnecting, connectionError } = useSocket();
  const room = useRoomStore((state) => state.room);

  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState(urlRoomCode?.toUpperCase() || '');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Navigate to game when joined
  useEffect(() => {
    if (room?.code) {
      navigate(`/game/${room.code}`);
    }
  }, [room, navigate]);

  const handleRoomCodeChange = (value: string) => {
    // Only allow uppercase alphanumeric
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setRoomCode(sanitized.slice(0, 8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (roomCode.length !== 8) {
      setError('Room code must be 8 characters');
      return;
    }

    setIsJoining(true);

    try {
      // Connect to socket
      await connect();

      // Join room
      emit.joinRoom({
        roomCode: roomCode,
        playerName: playerName.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>

        {/* Card */}
        <div className="bg-navy-800 rounded-2xl p-8 shadow-xl border border-navy-700">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Join a Room
          </h1>
          <p className="text-gray-400 mb-8">
            Enter the room code shared by the host
          </p>

          <form onSubmit={handleSubmit}>
            {/* Player name */}
            <div className="mb-6">
              <label htmlFor="playerName" className="label">
                Your Name
              </label>
              <input
                id="playerName"
                type="text"
                className="input"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={30}
                autoFocus={!urlRoomCode}
              />
            </div>

            {/* Room code */}
            <div className="mb-6">
              <label htmlFor="roomCode" className="label">
                Room Code
              </label>
              <input
                id="roomCode"
                type="text"
                className="input text-center font-mono text-2xl tracking-[0.3em] uppercase"
                placeholder="ABCD1234"
                value={roomCode}
                onChange={(e) => handleRoomCodeChange(e.target.value)}
                maxLength={8}
                autoFocus={!!urlRoomCode}
              />
              <p className="text-gray-500 text-xs mt-1 text-center">
                8-character code from the host
              </p>
            </div>

            {/* Error message */}
            {(error || connectionError) && (
              <div className="mb-6 p-3 bg-hearts/10 border border-hearts/30 rounded-lg text-hearts text-sm">
                {error || connectionError}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isJoining || isConnecting}
              disabled={roomCode.length !== 8}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>
          </form>
        </div>

        {/* Info text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have a code?{' '}
          <Link to="/create" className="text-teal hover:underline">
            Create a room
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
