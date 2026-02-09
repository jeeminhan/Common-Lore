import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useRoomStore } from '@/stores/roomStore';
import { useSocket } from '@/hooks/useSocket';
import CardHand from '@/components/cards/CardHand';
import CardPile from '@/components/cards/CardPile';
import PlayerCircle from './PlayerCircle';
import QuestionDisplay from './QuestionDisplay';
import Timer from '@/components/ui/Timer';
import Button from '@/components/ui/Button';

interface GameBoardProps {
  roomCode: string;
}

export default function GameBoard({ roomCode }: GameBoardProps) {
  const { emit } = useSocket();

  // Room state
  const room = useRoomStore((state) => state.room);
  const myPlayerId = useRoomStore((state) => state.myPlayerId);

  // Game state
  const gameState = useGameStore((state) => state.gameState);
  const myHand = useGameStore((state) => state.myHand);
  const selectedCardId = useGameStore((state) => state.selectedCardId);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const isAnswering = useGameStore((state) => state.isAnswering);
  const timerSeconds = useGameStore((state) => state.timerSecondsRemaining);
  const selectCard = useGameStore((state) => state.selectCard);

  // Compute isMyTurn from gameState and myPlayerId
  const isMyTurn = gameState && myPlayerId
    ? gameState.turnOrder[gameState.currentPlayerIndex] === myPlayerId
    : false;

  const canPlayCard = isMyTurn && gameState?.phase === 'playing' && !isAnswering;

  if (!gameState || !room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-400">Loading game...</span>
      </div>
    );
  }

  const currentPlayerId = gameState.turnOrder[gameState.currentPlayerIndex];
  const currentPlayer = room.players.find((p) => p.id === currentPlayerId);

  const handlePlayCard = (cardId: string) => {
    console.log('handlePlayCard called with:', cardId);
    emit.playCard(roomCode, cardId);
    selectCard(null);
  };

  const handleBridgePass = (reason: 'pass' | 'under_construction') => {
    emit.bridgePass(roomCode, reason);
  };

  const handleAnswerComplete = (highlight?: boolean) => {
    emit.answerComplete(roomCode, highlight);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Top: Other players */}
      <div className="pt-4">
        <PlayerCircle
          players={room.players}
          currentPlayerId={currentPlayerId}
          myPlayerId={myPlayerId}
        />
      </div>

      {/* Center: Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Turn indicator */}
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-400">
            {isMyTurn ? (
              <span className="text-teal font-semibold">Your turn</span>
            ) : (
              <span>
                Waiting for <strong className="text-white">{currentPlayer?.name}</strong>
              </span>
            )}
          </span>
        </div>

        {/* Piles and question area */}
        <div className="flex items-start justify-center gap-16 mb-6">
          {/* Journey Pile */}
          <CardPile
            type="journey"
            cards={gameState.journeyPile}
            count={gameState.journeyPile.length}
          />

          {/* Current question / center area */}
          <div className="w-[400px]">
            <QuestionDisplay
              card={currentQuestion}
              playerName={currentPlayer?.name}
              isAnswering={isAnswering && isMyTurn}
            />
          </div>

          {/* Discard Pile */}
          <CardPile
            type="discard"
            cards={gameState.discardPile}
            topCard={gameState.discardPile[gameState.discardPile.length - 1]}
          />
        </div>

        {/* Timer */}
        {room.settings.timerEnabled && timerSeconds !== null && (
          <div className="mb-4">
            <Timer
              secondsRemaining={timerSeconds}
              totalSeconds={room.settings.timerDurationSeconds}
            />
          </div>
        )}

        {/* Action buttons */}
        {isMyTurn && (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isAnswering ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => handleAnswerComplete(false)}
                >
                  Done Answering
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleAnswerComplete(true)}
                >
                  ⭐ Highlight & Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleBridgePass('pass')}
                  disabled={!canPlayCard}
                >
                  Pass
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleBridgePass('under_construction')}
                  disabled={!canPlayCard}
                >
                  🚧 Under Construction
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom: My hand */}
      <div className="bg-navy-950/50 border-t border-navy-800">
        <CardHand
          cards={myHand}
          selectedCardId={selectedCardId}
          onSelectCard={selectCard}
          onPlayCard={handlePlayCard}
          isMyTurn={isMyTurn}
          canPlay={canPlayCard}
        />
      </div>
    </div>
  );
}
