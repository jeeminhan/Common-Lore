import type { Card } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';

interface CardFaceProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
}

const textSizes = {
  sm: {
    rank: 'text-lg',
    symbol: 'text-xl',
    prompt: 'text-[10px]',
    action: 'text-[9px]',
  },
  md: {
    rank: 'text-2xl',
    symbol: 'text-3xl',
    prompt: 'text-xs',
    action: 'text-[10px]',
  },
  lg: {
    rank: 'text-3xl',
    symbol: 'text-4xl',
    prompt: 'text-sm',
    action: 'text-xs',
  },
};

export default function CardFace({ card, size = 'md' }: CardFaceProps) {
  const suitTheme = SUIT_THEMES[card.suit];
  const sizes = textSizes[size];

  return (
    <div
      className="w-full h-full rounded-xl shadow-card overflow-hidden"
      style={{ backgroundColor: '#faf5f0' }}
    >
      {/* Border accent */}
      <div
        className="absolute inset-0 rounded-xl border-2 pointer-events-none"
        style={{ borderColor: suitTheme.color }}
      />

      {/* Top left corner */}
      <div className="absolute top-2 left-2 flex flex-col items-center">
        <span
          className={`font-bold ${sizes.rank}`}
          style={{ color: suitTheme.color }}
        >
          {card.rank}
        </span>
        <span className={sizes.symbol} style={{ color: suitTheme.color }}>
          {suitTheme.symbol}
        </span>
      </div>

      {/* Bottom right corner (inverted) */}
      <div className="absolute bottom-2 right-2 flex flex-col items-center rotate-180">
        <span
          className={`font-bold ${sizes.rank}`}
          style={{ color: suitTheme.color }}
        >
          {card.rank}
        </span>
        <span className={sizes.symbol} style={{ color: suitTheme.color }}>
          {suitTheme.symbol}
        </span>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-8 pb-8">
        {card.isActionCard ? (
          // Action card display
          <div className="text-center">
            <div
              className={`font-serif font-bold mb-2 ${sizes.rank}`}
              style={{ color: suitTheme.color }}
            >
              {card.actionType === 'referral' && 'The Referral'}
              {card.actionType === 'shared_table' && 'The Shared Table'}
              {card.actionType === 'translator' && 'The Translator'}
              {card.actionType === 'experiment' && 'The Experiment'}
            </div>
            <p
              className={`text-gray-700 leading-tight ${sizes.action}`}
              style={{ maxWidth: '90%', margin: '0 auto' }}
            >
              {card.actionDescription}
            </p>
          </div>
        ) : (
          // Question card display
          <div className="text-center px-2">
            {/* Suit theme header */}
            <div className="mb-2">
              <div
                className="font-serif font-semibold text-xs"
                style={{ color: suitTheme.color }}
              >
                {suitTheme.name}
              </div>
              <div className="text-gray-500 text-[8px] uppercase tracking-wider">
                {suitTheme.subtitle}
              </div>
            </div>

            {/* Question prompt */}
            <p
              className={`text-gray-800 leading-snug ${sizes.prompt}`}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: size === 'lg' ? 8 : size === 'md' ? 6 : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {card.prompt}
            </p>
          </div>
        )}
      </div>

      {/* Decorative corner accents */}
      <div
        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl"
        style={{ borderColor: `${suitTheme.color}40` }}
      />
      <div
        className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl"
        style={{ borderColor: `${suitTheme.color}40` }}
      />
      <div
        className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl"
        style={{ borderColor: `${suitTheme.color}40` }}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl"
        style={{ borderColor: `${suitTheme.color}40` }}
      />
    </div>
  );
}
