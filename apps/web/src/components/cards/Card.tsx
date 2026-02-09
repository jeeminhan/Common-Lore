import { motion } from 'framer-motion';
import type { Card as CardType } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';
import CardFace from './CardFace';
import CardBack from './CardBack';

interface CardProps {
  card: CardType;
  isFlipped?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-[120px] h-[168px]',
  md: 'w-[160px] h-[224px]',
  lg: 'w-[200px] h-[280px]',
};

export default function Card({
  card,
  isFlipped = false,
  isSelected = false,
  isPlayable = true,
  onClick,
  size = 'md',
  className = '',
}: CardProps) {
  const suitTheme = SUIT_THEMES[card.suit];

  return (
    <motion.div
      className={`
        relative cursor-pointer perspective-1000
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={isPlayable ? onClick : undefined}
      whileHover={isPlayable ? { y: -8, scale: 1.02 } : undefined}
      whileTap={isPlayable ? { scale: 0.98 } : undefined}
      animate={{
        y: isSelected ? -20 : 0,
        boxShadow: isSelected
          ? `0 0 20px ${suitTheme.accentColor}40`
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="relative w-full h-full transform-style-preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Front face */}
        <div className="absolute w-full h-full backface-hidden">
          <CardFace card={card} size={size} />
        </div>

        {/* Back face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <CardBack size={size} />
        </div>
      </motion.div>

      {/* Selection ring */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 pointer-events-none"
          style={{ borderColor: suitTheme.accentColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layoutId="card-selection"
        />
      )}

      {/* Disabled overlay */}
      {!isPlayable && (
        <div className="absolute inset-0 bg-black/30 rounded-xl cursor-not-allowed" />
      )}
    </motion.div>
  );
}
