import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useRoomStore } from '@/stores/roomStore';
import Button from '@/components/ui/Button';

export default function CreateRoom() {
  const navigate = useNavigate();
  const { connect, emit, isConnecting, connectionError } = useSocket();
  const room = useRoomStore((state) => state.room);

  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Navigate to game when room is created
  useEffect(() => {
    if (room?.code) {
      navigate(`/game/${room.code}`);
    }
  }, [room, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hostName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);

    try {
      // Connect to socket
      await connect();

      // Create room
      emit.createRoom({
        hostName: hostName.trim(),
        roomName: roomName.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      setIsCreating(false);
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
            Create a Room
          </h1>
          <p className="text-gray-400 mb-8">
            Start a new game and invite friends to join
          </p>

          <form onSubmit={handleSubmit}>
            {/* Host name */}
            <div className="mb-6">
              <label htmlFor="hostName" className="label">
                Your Name
              </label>
              <input
                id="hostName"
                type="text"
                className="input"
                placeholder="Enter your name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                maxLength={30}
                autoFocus
              />
            </div>

            {/* Room name (optional) */}
            <div className="mb-6">
              <label htmlFor="roomName" className="label">
                Room Name{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="roomName"
                type="text"
                className="input"
                placeholder="e.g., Friday Night Fellowship"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={50}
              />
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
              isLoading={isCreating || isConnecting}
            >
              {isCreating ? 'Creating Room...' : 'Create Room'}
            </Button>
          </form>
        </div>

        {/* Info text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          You'll receive a room code to share with friends
        </p>
      </motion.div>
    </div>
  );
}
