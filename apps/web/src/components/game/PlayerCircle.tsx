import { motion } from 'framer-motion';
import type { Player } from '@crossings/shared';

interface PlayerCircleProps {
  players: Player[];
  currentPlayerId: string | null;
  myPlayerId: string | null;
}

export default function PlayerCircle({
  players,
  currentPlayerId,
  myPlayerId,
}: PlayerCircleProps) {
  // Filter out self and arrange other players
  const otherPlayers = players.filter((p) => p.id !== myPlayerId);
  const playerCount = otherPlayers.length;

  // Calculate positions in a semi-circle (top half)
  const getPlayerPosition = (index: number) => {
    // Spread players across top half of circle
    const angleRange = Math.PI; // 180 degrees
    const startAngle = Math.PI; // Start from left
    const angleStep = angleRange / (playerCount + 1);
    const angle = startAngle + angleStep * (index + 1);

    // Position on ellipse
    const radiusX = 280;
    const radiusY = 120;
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY - 60; // Shift up

    return { x, y };
  };

  return (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      {otherPlayers.map((player, index) => {
        const position = getPlayerPosition(index);
        const isCurrentTurn = player.id === currentPlayerId;
        const isDisconnected = player.status === 'disconnected';

        return (
          <motion.div
            key={player.id}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: position.x,
              y: position.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: index * 0.1,
            }}
          >
            {/* Player avatar */}
            <div className="flex flex-col items-center">
              {/* Avatar circle */}
              <motion.div
                className={`
                  relative w-14 h-14 rounded-full
                  flex items-center justify-center
                  text-xl font-bold
                  ${isDisconnected ? 'bg-navy-700 text-gray-500' : 'bg-navy-800 text-white'}
                  border-2
                  ${isCurrentTurn ? 'border-teal' : 'border-navy-600'}
                `}
                animate={
                  isCurrentTurn
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(13, 148, 136, 0.4)',
                          '0 0 0 10px rgba(13, 148, 136, 0)',
                        ],
                      }
                    : {}
                }
                transition={
                  isCurrentTurn
                    ? { repeat: Infinity, duration: 1.5 }
                    : {}
                }
              >
                {/* Avatar letter or emoji */}
                {player.avatar || player.name.charAt(0).toUpperCase()}

                {/* Status indicator */}
                <div
                  className={`
                    absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-navy-900
                    ${isDisconnected ? 'bg-gray-500' : 'bg-green-500'}
                  `}
                />

                {/* Host badge */}
                {player.isHost && (
                  <div className="absolute -top-1 -right-1 bg-gold text-navy-900 text-[8px] px-1 rounded font-bold">
                    HOST
                  </div>
                )}
              </motion.div>

              {/* Player name */}
              <span
                className={`
                  mt-1 text-xs font-medium truncate max-w-[80px]
                  ${isCurrentTurn ? 'text-teal' : 'text-gray-400'}
                  ${isDisconnected ? 'opacity-50' : ''}
                `}
              >
                {player.name}
              </span>

              {/* Card count */}
              <span className="text-[10px] text-gray-500">
                {player.hand?.length ?? '?'} cards
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
