import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeedbackStore } from '../stores/feedbackStore';

export default function Home() {
  const openFeedback = useFeedbackStore((s) => s.openFeedback);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Chevron icon */}
          <svg
            className="w-12 h-12 text-teal mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
            <polyline points="6 4 12 10 18 4" />
          </svg>

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 tracking-wide">
            COMMON LORE
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Weave individual stories into a Shared Lore by discovering the universal truths that connect our careers, cultures, homes, and wonders.
          </p>
        </motion.div>

        {/* Three paths */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Play Solo - Primary */}
          <Link to="/solo" className="group">
            <div className="bg-teal/10 border-2 border-teal rounded-2xl p-6 text-center hover:bg-teal/20 transition-all h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-teal rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Play Solo</h2>
              <p className="text-gray-400 text-sm">Draw cards and reflect on your own</p>
            </div>
          </Link>

          {/* Create Room */}
          <Link to="/create" className="group">
            <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 text-center hover:bg-navy-800 hover:border-teal/50 transition-all h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-navy-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Create Room</h2>
              <p className="text-gray-400 text-sm">Start a multiplayer session for 2-6 players</p>
            </div>
          </Link>

          {/* Join Room */}
          <Link to="/join" className="group">
            <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 text-center hover:bg-navy-800 hover:border-teal/50 transition-all h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-navy-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Join Room</h2>
              <p className="text-gray-400 text-sm">Enter a room code to join friends</p>
            </div>
          </Link>
        </motion.div>

        {/* Links */}
        <motion.div
          className="flex justify-center flex-wrap gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/how-to-play"
            className="text-gray-400 hover:text-teal transition-colors text-sm"
          >
            How to Play
          </Link>
          <Link
            to="/how-to-play?tab=facilitator"
            className="text-gray-400 hover:text-teal transition-colors text-sm"
          >
            Facilitator's Guide
          </Link>
          <button
            onClick={() => openFeedback()}
            className="text-gray-400 hover:text-purple transition-colors text-sm"
          >
            Leave Feedback
          </button>
        </motion.div>
      </div>

      {/* Suit preview */}
      <motion.div
        className="py-12 border-t border-navy-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6">
            Four Bridges to Cross
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { symbol: '♠', name: 'Career', color: '#1e40af' },
              { symbol: '♥', name: 'Hospitality', color: '#dc2626' },
              { symbol: '♦', name: 'Culture', color: '#eab308' },
              { symbol: '♣', name: 'Wonder', color: '#16a34a' },
            ].map((suit) => (
              <div
                key={suit.name}
                className="bg-navy-800/50 rounded-xl p-4 text-center border border-navy-700"
              >
                <span
                  className="text-3xl block mb-2"
                  style={{ color: suit.color }}
                >
                  {suit.symbol}
                </span>
                <span className="text-sm text-gray-400">{suit.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm border-t border-navy-800">
        <p>
          Frontier Commons Innovation Lab &bull;{' '}
          <a
            href="https://www.ifiusa.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            International Friendships, Inc.
          </a>
        </p>
      </footer>
    </div>
  );
}
