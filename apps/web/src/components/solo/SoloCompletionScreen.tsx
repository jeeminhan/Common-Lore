import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Card } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';
import { useFeedbackStore } from '../../stores/feedbackStore';

interface SoloCompletionScreenProps {
  sharedLore: Card[];
  bridgePasses: number;
  onPlayAgain: () => void;
}

export default function SoloCompletionScreen({
  sharedLore,
  bridgePasses,
  onPlayAgain,
}: SoloCompletionScreenProps) {
  const openFeedback = useFeedbackStore((s) => s.openFeedback);

  // Count cards by suit
  const suitCounts = sharedLore.reduce(
    (acc, card) => {
      acc[card.suit] = (acc[card.suit] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <motion.div
      className="max-w-2xl w-full mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="bg-card-face rounded-3xl p-8 md:p-12 shadow-xl text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-2">
          Session Complete
        </h1>
        <p className="text-gray-500 mb-8">Thank you for reflecting with Common Lore</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-teal/5 rounded-xl p-4 border border-teal/20">
            <div className="text-3xl font-bold text-teal">{sharedLore.length}</div>
            <div className="text-sm text-gray-500">Stories Shared</div>
          </div>
          <div className="bg-navy-100/50 rounded-xl p-4 border border-navy-200">
            <div className="text-3xl font-bold text-navy-700">{bridgePasses}</div>
            <div className="text-sm text-gray-500">Bridge Passes</div>
          </div>
        </div>

        {/* Suit breakdown */}
        {sharedLore.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">
              Bridges Explored
            </h3>
            <div className="flex justify-center gap-3">
              {Object.entries(SUIT_THEMES).map(([suit, theme]) => (
                <div key={suit} className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold mb-1"
                    style={{ backgroundColor: suitCounts[suit] ? theme.color : '#e5e7eb' }}
                  >
                    {theme.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{suitCounts[suit] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="btn-primary text-lg px-8 py-4"
          >
            Play Again
          </button>
          <button
            onClick={() => openFeedback()}
            className="btn bg-white border-2 border-teal text-teal hover:bg-teal hover:text-white text-lg px-8 py-4"
          >
            Give Feedback
          </button>
          <Link
            to="/"
            className="text-gray-500 hover:text-teal transition-colors mt-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
