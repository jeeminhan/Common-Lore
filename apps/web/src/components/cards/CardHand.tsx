import { motion } from 'framer-motion';
import type { Card as CardType } from '@crossings/shared';
import Card from './Card';

interface CardHandProps {
  cards: CardType[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onPlayCard: (cardId: string) => void;
  isMyTurn: boolean;
  canPlay: boolean;
}

export default function CardHand({
  cards,
  selectedCardId,
  onSelectCard: _onSelectCard,
  onPlayCard,
  isMyTurn,
  canPlay,
}: CardHandProps) {
  const cardCount = cards.length;

  // Calculate fan layout
  const getCardStyle = (index: number) => {
    const spreadAngle = Math.min(8, 40 / cardCount); // Degrees between cards
    const totalSpread = spreadAngle * (cardCount - 1);
    const startAngle = -totalSpread / 2;
    const rotation = startAngle + spreadAngle * index;

    // Horizontal spacing
    const horizontalSpread = Math.min(60, 280 / cardCount);
    const totalWidth = horizontalSpread * (cardCount - 1);
    const startX = -totalWidth / 2;
    const translateX = startX + horizontalSpread * index;

    // Vertical arc
    const normalizedPos = (index / (cardCount - 1 || 1)) * 2 - 1; // -1 to 1
    const arcHeight = 20;
    const translateY = Math.abs(normalizedPos) * arcHeight;

    return {
      rotation,
      translateX,
      translateY,
      zIndex: index,
    };
  };

  const handleCardClick = (cardId: string) => {
    if (!canPlay) return;
    // Single click to play the card directly
    onPlayCard(cardId);
  };

  return (
    <div className="relative h-[300px] w-full flex items-end justify-center pb-4">
      {/* Hand container */}
      <div className="relative" style={{ width: '400px', height: '250px' }}>
        {cards.map((card, index) => {
          const style = getCardStyle(index);
          const isSelected = selectedCardId === card.id;

          return (
            <motion.div
              key={card.id}
              className="absolute left-1/2 bottom-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                x: style.translateX,
                y: isSelected ? style.translateY - 30 : style.translateY,
                rotate: style.rotation,
                zIndex: isSelected ? 100 : style.zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: index * 0.05,
              }}
              whileHover={{
                y: style.translateY - 20,
                zIndex: 50,
                transition: { duration: 0.2 },
              }}
              style={{
                transformOrigin: 'bottom center',
                marginLeft: '-80px', // Half of card width
              }}
            >
              <Card
                card={card}
                isSelected={isSelected}
                isPlayable={canPlay}
                onClick={() => handleCardClick(card.id)}
                size="md"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Play hint */}
      {isMyTurn && canPlay && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm text-teal bg-navy-800 px-3 py-1 rounded-full">
            Click a card to play it
          </span>
        </motion.div>
      )}

      {/* Turn indicator */}
      {!isMyTurn && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2">
          <span className="text-sm text-gray-400 bg-navy-800 px-3 py-1 rounded-full">
            Waiting for your turn...
          </span>
        </div>
      )}
    </div>
  );
}
