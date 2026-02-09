import { motion } from 'framer-motion';
import type { Card as CardType } from '@crossings/shared';
import CardBack from './CardBack';
import CardFace from './CardFace';

interface CardPileProps {
  type: 'journey' | 'discard';
  cards: CardType[];
  topCard?: CardType | null;
  count?: number;
}

export default function CardPile({
  type,
  cards,
  topCard,
  count,
}: CardPileProps) {
  const pileCount = count ?? cards.length;
  const showStack = pileCount > 0;

  // Create stacked effect (show up to 4 cards in stack)
  const stackCards = Math.min(4, pileCount);

  return (
    <div className="relative">
      {/* Pile label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {type === 'journey' ? 'Journey Pile' : 'Discard'}
        </span>
      </div>

      {/* Stack container */}
      <div className="relative w-[120px] h-[168px]">
        {showStack ? (
          <>
            {/* Stacked cards for depth effect */}
            {[...Array(stackCards)].map((_, i) => (
              <motion.div
                key={`stack-${i}`}
                className="absolute"
                style={{
                  top: (stackCards - 1 - i) * 2,
                  left: (stackCards - 1 - i) * 1,
                  zIndex: i,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {type === 'journey' ? (
                  <div className="w-[120px] h-[168px]">
                    <CardBack size="sm" />
                  </div>
                ) : (
                  <div className="w-[120px] h-[168px] opacity-50">
                    {topCard && i === stackCards - 1 ? (
                      <CardFace card={topCard} size="sm" />
                    ) : (
                      <div className="w-full h-full bg-card-face rounded-xl shadow-card" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Top card with animation */}
            {type === 'discard' && topCard && (
              <motion.div
                className="absolute"
                style={{ zIndex: stackCards + 1 }}
                initial={{ scale: 1.1, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="w-[120px] h-[168px]">
                  <CardFace card={topCard} size="sm" />
                </div>
              </motion.div>
            )}
          </>
        ) : (
          // Empty pile placeholder
          <div className="w-[120px] h-[168px] rounded-xl border-2 border-dashed border-navy-700 flex items-center justify-center">
            <span className="text-navy-600 text-xs">Empty</span>
          </div>
        )}
      </div>

      {/* Card count */}
      {showStack && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          <span className="text-xs text-gray-500 bg-navy-800 px-2 py-0.5 rounded">
            {pileCount} {pileCount === 1 ? 'card' : 'cards'}
          </span>
        </div>
      )}
    </div>
  );
}
