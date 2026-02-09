import { motion, AnimatePresence } from 'framer-motion';
import type { Card } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';

interface QuestionDisplayProps {
  card: Card | null;
  playerName?: string;
  isAnswering?: boolean;
}

export default function QuestionDisplay({
  card,
  playerName,
  isAnswering = false,
}: QuestionDisplayProps) {
  if (!card) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="text-gray-500">Waiting for a card to be played...</span>
      </div>
    );
  }

  const suitTheme = SUIT_THEMES[card.suit];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.id}
        className="w-full max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Suit indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="text-2xl"
            style={{ color: suitTheme.color }}
          >
            {suitTheme.symbol}
          </span>
          <span
            className="font-serif font-semibold"
            style={{ color: suitTheme.color }}
          >
            {suitTheme.name}
          </span>
          <span
            className="text-2xl"
            style={{ color: suitTheme.color }}
          >
            {suitTheme.symbol}
          </span>
        </div>

        {/* Question card */}
        <motion.div
          className="relative bg-card-face rounded-2xl p-6 shadow-lg"
          style={{
            borderLeft: `4px solid ${suitTheme.color}`,
          }}
          animate={
            isAnswering
              ? {
                  boxShadow: [
                    `0 0 0 0 ${suitTheme.color}20`,
                    `0 0 20px 5px ${suitTheme.color}20`,
                    `0 0 0 0 ${suitTheme.color}20`,
                  ],
                }
              : {}
          }
          transition={isAnswering ? { repeat: Infinity, duration: 2 } : {}}
        >
          {/* Action card handling */}
          {card.isActionCard ? (
            <div className="text-center">
              <h3
                className="font-serif text-2xl font-bold mb-3"
                style={{ color: suitTheme.color }}
              >
                {card.actionType === 'referral' && 'The Referral'}
                {card.actionType === 'shared_table' && 'The Shared Table'}
                {card.actionType === 'translator' && 'The Translator'}
                {card.actionType === 'experiment' && 'The Experiment'}
              </h3>
              <p className="text-navy-700 text-lg">{card.actionDescription}</p>
            </div>
          ) : (
            // Regular question card
            <p className="text-navy-800 text-xl leading-relaxed text-center font-serif">
              "{card.prompt}"
            </p>
          )}

          {/* Player attribution */}
          {playerName && (
            <div className="mt-4 pt-3 border-t border-navy-200 text-center">
              <span className="text-sm text-navy-600">
                {isAnswering ? 'Answering: ' : 'Asked by: '}
                <strong>{playerName}</strong>
              </span>
            </div>
          )}
        </motion.div>

        {/* Answering status */}
        {isAnswering && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="inline-flex items-center gap-2 text-teal bg-teal/10 px-4 py-2 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
              </span>
              Share your answer with the group
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
