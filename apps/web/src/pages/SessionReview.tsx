import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSessionStore } from '@/stores/sessionStore';
import { SUIT_THEMES } from '@crossings/shared';
import Button from '@/components/ui/Button';

export default function SessionReview() {
  const { sessionId: _sessionId } = useParams<{ sessionId: string }>();
  const session = useSessionStore((state) => state.session);

  // If no session data, show placeholder
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Session Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            This session may have expired or doesn't exist.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const highlightedMoments = session.moments.filter((m) => m.isHighlighted);
  const durationMinutes = session.duration || 0;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            Session Complete
          </h1>
          <p className="text-gray-400">
            {session.roomName || 'Crossings Game'} •{' '}
            {new Date(session.startedAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-navy-700">
            <div className="text-3xl font-bold text-teal mb-1">
              {session.players.length}
            </div>
            <div className="text-gray-400 text-sm">Players</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-navy-700">
            <div className="text-3xl font-bold text-gold mb-1">
              {session.moments.length}
            </div>
            <div className="text-gray-400 text-sm">Cards Played</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-navy-700">
            <div className="text-3xl font-bold text-white mb-1">
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </div>
            <div className="text-gray-400 text-sm">Duration</div>
          </div>
        </motion.div>

        {/* Highlighted moments */}
        {highlightedMoments.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-gold">⭐</span> Highlighted Moments
            </h2>

            <div className="space-y-4">
              {highlightedMoments.map((moment) => {
                const suitTheme = moment.card
                  ? SUIT_THEMES[moment.card.suit]
                  : null;

                return (
                  <div
                    key={moment.id}
                    className="bg-navy-800 rounded-xl p-4 border border-navy-700"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: suitTheme?.color || '#0d9488',
                    }}
                  >
                    {moment.card && (
                      <div className="mb-2">
                        <span
                          className="text-sm font-medium"
                          style={{ color: suitTheme?.color }}
                        >
                          {suitTheme?.symbol} {suitTheme?.name}
                        </span>
                      </div>
                    )}
                    <p className="text-white font-serif">
                      "{moment.card?.prompt}"
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Shared by {moment.playerName}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Final reflections */}
        {session.finalReflections.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              What We'll Carry
            </h2>

            <div className="space-y-4">
              {session.finalReflections.map((reflection) => (
                <div
                  key={reflection.playerId}
                  className="bg-navy-800 rounded-xl p-4 border border-navy-700"
                >
                  <p className="text-white italic">"{reflection.reflection}"</p>
                  <p className="text-gray-400 text-sm mt-2">
                    — {reflection.playerName}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="secondary">Export PDF</Button>
          <Link to="/">
            <Button variant="primary">Play Again</Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-12">
          <p>Thank you for playing Crossings</p>
          <p className="mt-1">
            "What is one thing someone shared tonight that you'll carry with you?"
          </p>
        </div>
      </div>
    </div>
  );
}
