import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SUIT_THEMES } from '@crossings/shared';
import { useSoloStore } from '../stores/soloStore';
import { useFeedbackStore } from '../stores/feedbackStore';
import DeckStack from '../components/solo/DeckStack';
import SharedLoreTracker from '../components/solo/SharedLoreTracker';
import FinalStoneDisplay from '../components/solo/FinalStoneDisplay';
import SoloCompletionScreen from '../components/solo/SoloCompletionScreen';

export default function SoloPlay() {
  const {
    phase,
    deck,
    currentCard,
    sharedLore,
    bridgePasses,
    startGame,
    drawCard,
    markShared,
    bridgePass,
    goToFinalStone,
  } = useSoloStore();

  const startFeedbackTimer = useFeedbackStore((s) => s.startTimer);

  // Start game on mount if idle
  useEffect(() => {
    if (phase === 'idle') {
      startGame();
      startFeedbackTimer();
    }
  }, []);

  const canGoToFinalStone = deck.length === 0 || sharedLore.length >= 10;

  // Final Stone phase
  if (phase === 'final_stone') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <FinalStoneDisplay
          sharedLore={sharedLore}
          onComplete={() => useSoloStore.setState({ phase: 'completed' })}
        />
      </div>
    );
  }

  // Completed phase
  if (phase === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SoloCompletionScreen
          sharedLore={sharedLore}
          bridgePasses={bridgePasses}
          onPlayAgain={() => {
            startGame();
            startFeedbackTimer();
          }}
        />
      </div>
    );
  }

  const suitTheme = currentCard ? SUIT_THEMES[currentCard.suit] : null;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="flex gap-4 text-white/70 text-sm">
          <span>Deck: {deck.length}</span>
          <span>Shared: {sharedLore.length}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentCard ? (
            <motion.div
              key={currentCard.id}
              className="w-72 md:w-80 min-h-[400px] rounded-2xl shadow-2xl p-6 flex flex-col relative overflow-hidden"
              style={{
                backgroundColor: currentCard.isActionCard ? suitTheme!.color : '#faf5f0',
                borderLeft: currentCard.isActionCard ? undefined : `4px solid ${suitTheme!.color}`,
              }}
              initial={{ opacity: 0, y: 20, rotateY: -90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Rank and suit */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: currentCard.isActionCard ? 'white' : suitTheme!.color }}
                  >
                    {currentCard.rank}
                  </span>
                  <span
                    className="text-2xl ml-1"
                    style={{ color: currentCard.isActionCard ? 'rgba(255,255,255,0.8)' : suitTheme!.color }}
                  >
                    {suitTheme!.symbol}
                  </span>
                </div>
                {currentCard.isActionCard && (
                  <span className="text-xs uppercase tracking-wide text-white/70">Action Card</span>
                )}
              </div>

              {/* Action card title */}
              {currentCard.isActionCard && (
                <div className="text-center my-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {currentCard.actionType === 'referral' && 'The Referral'}
                    {currentCard.actionType === 'shared_table' && 'The Shared Table'}
                    {currentCard.actionType === 'translator' && 'The Translator'}
                    {currentCard.actionType === 'experiment' && 'The Experiment'}
                  </h3>
                </div>
              )}

              {/* Card content */}
              <div className="flex-1 flex items-center">
                <p
                  className={`text-lg leading-relaxed ${
                    currentCard.isActionCard ? 'text-white text-center' : 'text-gray-800'
                  }`}
                >
                  {currentCard.isActionCard
                    ? currentCard.actionDescription
                    : currentCard.prompt}
                </p>
              </div>

              {/* Solo mode note for action cards */}
              {currentCard.isActionCard && (
                <p className="text-white/50 text-xs text-center mt-4 italic">
                  In solo mode, reflect on this theme and mark as shared
                </p>
              )}

              {/* Footer */}
              <div
                className={`mt-4 pt-4 border-t ${
                  currentCard.isActionCard ? 'border-white/20' : 'border-gray-200'
                }`}
              >
                <p
                  className={`text-xs text-center ${
                    currentCard.isActionCard ? 'text-white/60' : 'text-gray-400'
                  }`}
                >
                  {suitTheme!.name} &bull; {suitTheme!.subtitle}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="deck"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {deck.length > 0 ? (
                <DeckStack cardsRemaining={deck.length} onDraw={drawCard} />
              ) : (
                <div className="text-center text-white/50">
                  <p className="text-xl mb-4">The deck is empty</p>
                  <p className="text-sm">Proceed to The Final Stone</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {currentCard ? (
          <>
            <div className="flex gap-4">
              <motion.button
                onClick={markShared}
                className="px-6 py-3 bg-teal text-white rounded-xl font-semibold hover:bg-teal-light transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shared
              </motion.button>
              <motion.button
                onClick={bridgePass}
                className="px-6 py-3 bg-navy-800 text-white rounded-xl font-semibold border border-navy-700 hover:bg-navy-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Bridge Pass
              </motion.button>
            </div>
            <p className="text-white/40 text-sm">
              Skip if the question feels too personal right now
            </p>
          </>
        ) : (
          <>
            {deck.length > 0 && (
              <motion.button
                onClick={drawCard}
                className="px-8 py-4 btn-primary text-lg animate-pulse-slow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Draw Card
              </motion.button>
            )}
            {canGoToFinalStone && (
              <motion.button
                onClick={goToFinalStone}
                className="px-6 py-3 bg-card-face text-teal rounded-xl font-semibold hover:bg-white transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                The Final Stone &rarr;
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Shared Lore Tracker */}
      <div className="mt-8">
        <SharedLoreTracker sharedLore={sharedLore} />
      </div>
    </div>
  );
}
