import { motion } from 'framer-motion';
import type { Card } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';

interface FinalStoneDisplayProps {
  sharedLore: Card[];
  onComplete: () => void;
}

export default function FinalStoneDisplay({ sharedLore, onComplete }: FinalStoneDisplayProps) {
  return (
    <motion.div
      className="max-w-2xl w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-card-face rounded-3xl p-8 md:p-12 shadow-xl text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
          The Final Stone
        </h1>
        <p className="text-gray-600 mb-8">Take a moment to reflect:</p>

        <div className="bg-teal/5 rounded-2xl p-6 mb-8 border border-teal/20">
          <p className="font-serif text-xl md:text-2xl text-teal italic leading-relaxed">
            "What is one thing you reflected on tonight that you'll be thinking about on your walk home?"
          </p>
        </div>

        {sharedLore.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4">
              Your Shared Lore
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {sharedLore.map((card, i) => {
                const theme = SUIT_THEMES[card.suit];
                return (
                  <div
                    key={`${card.id}-${i}`}
                    className="w-10 h-12 rounded flex items-center justify-center text-white text-sm font-bold shadow"
                    style={{ backgroundColor: theme.color }}
                    title={card.prompt || card.actionDescription}
                  >
                    {card.rank}{theme.symbol}
                  </div>
                );
              })}
            </div>
            <p className="text-gray-500 text-sm mt-3">
              {sharedLore.length} {sharedLore.length === 1 ? 'story' : 'stories'} woven into your Shared Lore
            </p>
          </div>
        )}

        <button
          onClick={onComplete}
          className="btn-primary text-lg px-8 py-4"
        >
          Complete Session
        </button>
      </div>
    </motion.div>
  );
}
