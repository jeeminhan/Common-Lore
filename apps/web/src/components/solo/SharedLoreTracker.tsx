import type { Card } from '@crossings/shared';
import { SUIT_THEMES } from '@crossings/shared';

interface SharedLoreTrackerProps {
  sharedLore: Card[];
}

export default function SharedLoreTracker({ sharedLore }: SharedLoreTrackerProps) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 max-w-2xl mx-auto w-full">
      <h3 className="text-white/70 text-sm font-semibold mb-3 text-center">
        Shared Lore ({sharedLore.length} {sharedLore.length === 1 ? 'story' : 'stories'})
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {sharedLore.length === 0 ? (
          <p className="text-white/30 text-sm">Stories shared will appear here</p>
        ) : (
          sharedLore.slice(-12).map((card, i) => {
            const theme = SUIT_THEMES[card.suit];
            return (
              <div
                key={`${card.id}-${i}`}
                className="w-8 h-10 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: theme.color }}
                title={`${card.rank}${theme.symbol} - ${theme.name}`}
              >
                {card.rank}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
