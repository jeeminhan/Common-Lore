import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUIT_THEMES, Suit } from '@crossings/shared';
import { getCardsBySuit } from '../data/cards';

type Tab = 'rules' | 'cards' | 'facilitator' | 'closing';

const tabs: { id: Tab; label: string }[] = [
  { id: 'rules', label: 'How to Play' },
  { id: 'cards', label: 'All Cards' },
  { id: 'facilitator', label: "Facilitator's Guide" },
  { id: 'closing', label: 'The Final Stone' },
];

export default function HowToPlay() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'rules';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <Link to="/solo" className="btn-primary text-sm">
            Start Playing
          </Link>
        </div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            Common Lore
          </h1>
          <p className="text-gray-400">Complete Instructions &amp; Card Reference</p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-card-face rounded-3xl p-6 md:p-8 shadow-xl">
          {activeTab === 'rules' && <RulesTab />}
          {activeTab === 'cards' && <CardsTab />}
          {activeTab === 'facilitator' && <FacilitatorTab />}
          {activeTab === 'closing' && <ClosingTab />}
        </div>

        <div className="text-center mt-8 text-white/40 text-sm">
          <p>Format: Standard Poker Size (2.5" &times; 3.5") &bull; 52 Cards</p>
          <p className="mt-1">Frontier Commons Innovation Lab &bull; International Friendships, Inc.</p>
        </div>
      </div>
    </div>
  );
}

// ==================== RULES TAB ====================

function RulesTab() {
  const suits = [
    { suit: Suit.SPADES, description: 'Questions about career goals, professional identity, and vision for the future.' },
    { suit: Suit.HEARTS, description: 'Questions about family, home, belonging, and hospitality across cultures.' },
    { suit: Suit.DIAMONDS, description: 'Questions about cultural identity, traditions, and cross-cultural understanding.' },
    { suit: Suit.CLUBS, description: 'Questions exploring the intersection of science, faith, and wonder.' },
  ];

  const rules = [
    { num: '1', title: 'Deal', text: 'Shuffle the deck and deal 5 cards to each player. Place the remaining deck face down in the center.' },
    { num: '2', title: 'Share', text: 'Going clockwise, each player chooses a card in their hand and answers the question. Then the card is placed in the discard pile.' },
    { num: '3', title: 'The "Bridge Pass"', text: 'If a question feels too personal or you aren\'t ready to share, you can say "Pass" or "Under Construction," and draw a new card from the deck.' },
    { num: '4', title: 'Aces are Action Cards', text: 'You may play Aces as a special action any time before or after a player answers a question, triggering a special rule for that suit.' },
    { num: '5', title: '"Winning the Game"', text: 'Play until everyone\'s hand is empty. This game is about journey and discovery, not winning!' },
  ];

  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">How to Play</h2>

      <div className="mb-8 p-4 bg-teal/5 rounded-xl border border-teal/20">
        <h3 className="font-semibold text-teal mb-2">Objective</h3>
        <p className="text-gray-700">
          To weave individual stories into a <strong>"Shared Lore"</strong> by discovering the universal truths
          that connect our careers, cultures, homes, and wonders.
        </p>
      </div>

      <h3 className="font-semibold text-xl text-navy-900 mb-4">Rules</h3>
      <div className="space-y-4 mb-8">
        {rules.map((rule) => (
          <div key={rule.num} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold flex-shrink-0">
              {rule.num}
            </div>
            <div>
              <h4 className="font-semibold text-navy-900">{rule.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{rule.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-xl text-navy-900 mb-4">The Four Suits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suits.map(({ suit, description }) => {
          const theme = SUIT_THEMES[suit];
          return (
            <div
              key={suit}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ backgroundColor: `${theme.color}10` }}
            >
              <span className="text-4xl" style={{ color: theme.color }}>{theme.symbol}</span>
              <div>
                <div className="font-semibold text-navy-900">{theme.name}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ==================== CARDS TAB ====================

function CardsTab() {
  const suitOrder: Suit[] = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];

  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Complete Card Reference</h2>

      {suitOrder.map((suit) => {
        const theme = SUIT_THEMES[suit];
        const cards = getCardsBySuit(suit);
        const actionCard = cards.find((c) => c.isActionCard);
        const questionCards = cards.filter((c) => !c.isActionCard);

        return (
          <div key={suit} className="mb-10">
            <div
              className="flex items-center gap-3 mb-4 pb-3 border-b-2"
              style={{ borderColor: theme.color }}
            >
              <span className="text-4xl" style={{ color: theme.color }}>{theme.symbol}</span>
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">{theme.name}</h3>
                <p className="text-gray-500 text-sm">{theme.subtitle}</p>
              </div>
            </div>

            {/* Action card */}
            {actionCard && (
              <div
                className="mb-4 p-4 text-white rounded-xl"
                style={{ backgroundColor: theme.color }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">A{theme.symbol}</span>
                  <span className="text-xs uppercase tracking-wide opacity-70">Action Card</span>
                </div>
                <div className="font-semibold text-lg mb-1">
                  {actionCard.actionType === 'referral' && 'The Referral'}
                  {actionCard.actionType === 'shared_table' && 'The Shared Table'}
                  {actionCard.actionType === 'translator' && 'The Translator'}
                  {actionCard.actionType === 'experiment' && 'The Experiment'}
                </div>
                <p className="text-sm opacity-90">{actionCard.actionDescription}</p>
              </div>
            )}

            {/* Question cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questionCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3 border-2 rounded-xl bg-white"
                  style={{ borderColor: theme.color }}
                >
                  <span className="font-bold" style={{ color: theme.color }}>
                    {card.rank}{theme.symbol}
                  </span>
                  <p className="text-gray-700 text-sm mt-1">{card.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ==================== FACILITATOR TAB ====================

function FacilitatorTab() {
  const deepeningMoves = [
    { name: 'The "Tell me more" move', text: '"That sounds significant. Can you tell me more about that moment?"' },
    { name: 'The "Feeling" move', text: '"When that happened, what was going through your mind?"' },
    { name: 'The "Global" move', text: '"Do you think most people in your home city feel the same way, or is that unique to your family?"' },
    { name: 'The "Bridge" move', text: '"How does that [tradition/value] from back home help you navigate your life here in the U.S.?"' },
  ];

  const suitHandling = [
    { suit: Suit.SPADES, watch: 'Watch for anxiety', note: 'Many students feel immense pressure to succeed for their family.', ask: '"It sounds like you carry a lot of responsibility. Who supports you when the pressure is high?"' },
    { suit: Suit.HEARTS, watch: 'This can trigger homesickness', note: 'If a student gets emotional, don\'t apologize for the question.', ask: '"Thank you for sharing that piece of your heart with us. It\'s a beautiful thing to miss home that much."' },
    { suit: Suit.DIAMONDS, watch: 'Avoid "The Expert" trap', note: 'Don\'t let the conversation become a lecture about a country. Keep it personal.', ask: '"How does that specific legend shape how you see the world?"' },
    { suit: Suit.CLUBS, watch: 'Encourage "Wonder" over "Argument"', note: 'STEM students often feel they have to choose between their brain and their spirit.', ask: '"What is something you\'ve seen in a lab that felt like poetry?"' },
  ];

  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Facilitator's Guide</h2>
      <p className="text-gray-500 mb-8">For ISM Staff &amp; Group Leaders</p>

      {/* Section 1: The Opening */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg text-teal mb-3">1. The Opening (Setting the Table)</h3>
        <p className="text-gray-700 mb-4">Before the game, set the tone:</p>

        <div className="bg-teal/5 rounded-xl p-5 space-y-4 border border-teal/20">
          <div>
            <span className="font-semibold text-teal">The Invitation:</span>
            <p className="text-gray-600 italic mt-1">
              "This isn't an interview or a test. It's a way for us to move from being strangers to being a community. We're here to listen to your stories."
            </p>
          </div>
          <div>
            <span className="font-semibold text-teal">The "Oikos" Ethos:</span>
            <p className="text-gray-600 mt-1">
              Explain that in many cultures, the "household" (Oikos) is a place of absolute safety and hospitality. This table is an Oikos for the next hour.
            </p>
          </div>
          <div>
            <span className="font-semibold text-teal">The Right to Silence:</span>
            <p className="text-gray-600 mt-1">
              Remind them of the Bridge Pass. "If a card feels too heavy for today, just say 'Under Construction' and we'll move to the next one."
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Deepening */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg text-teal mb-3">2. The "Deepening" Technique (Follow-up Questions)</h3>
        <p className="text-gray-700 mb-4">
          When a student gives a short answer, don't rush to the next card. Use these "Bridge Expanders" to invite more depth:
        </p>

        <div className="space-y-3">
          {deepeningMoves.map((move, i) => (
            <div key={i} className="flex gap-3 items-start bg-white rounded-xl p-4 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-teal/10 text-teal flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <span className="font-semibold text-navy-900">{move.name}</span>
                <p className="text-gray-600 italic text-sm mt-1">{move.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Handling Suits */}
      <div>
        <h3 className="font-semibold text-lg text-teal mb-3">3. Handling Specific Suits</h3>
        <div className="space-y-4">
          {suitHandling.map((item) => {
            const theme = SUIT_THEMES[item.suit];
            return (
              <div
                key={item.suit}
                className="pl-4 py-3 bg-white rounded-r-xl shadow-sm"
                style={{ borderLeft: `4px solid ${theme.color}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" style={{ color: theme.color }}>{theme.symbol}</span>
                  <span className="font-semibold text-navy-900">{theme.name}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-gray-800">{item.watch}.</span> {item.note}
                </div>
                <div className="text-sm bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Pivot to:</span>
                  <span className="text-gray-600 italic"> {item.ask}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ==================== CLOSING TAB ====================

function ClosingTab() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">The Closing</h2>

      <div className="mb-8">
        <h3 className="font-semibold text-xl text-teal mb-4">The "Final Stone"</h3>
        <p className="text-gray-600 mb-6">
          To end the session, instead of a card, ask everyone to answer one final prompt:
        </p>

        <div className="bg-teal/5 rounded-2xl p-8 mb-8 border border-teal/20">
          <p className="font-serif text-xl md:text-2xl text-teal italic leading-relaxed">
            "What is one thing someone else shared tonight that you'll be thinking about on your walk home?"
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-lg text-navy-900 mb-4">Building Shared Lore</h3>
        <p className="text-gray-600 mb-4">Throughout the game, you're creating connections through:</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '♠', name: 'Careers', desc: 'Dreams & ambitions', color: '#1e40af' },
            { icon: '♥', name: 'Homes', desc: 'Belonging & family', color: '#dc2626' },
            { icon: '♦', name: 'Cultures', desc: 'Identity & wisdom', color: '#eab308' },
            { icon: '♣', name: 'Wonders', desc: 'Science & faith', color: '#16a34a' },
          ].map((pillar) => (
            <div key={pillar.name} className="bg-white rounded-xl p-4 shadow-sm border-2 border-teal/20">
              <div className="text-3xl mb-2" style={{ color: pillar.color }}>{pillar.icon}</div>
              <div className="font-semibold text-navy-900 text-sm">{pillar.name}</div>
              <div className="text-xs text-gray-500 mt-1">{pillar.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card-face border-2 border-dashed border-teal/30 rounded-xl p-6">
        <p className="text-gray-600 text-sm">
          <strong>Remember:</strong> This game is about journey and discovery, not winning.
          The goal is to move from being strangers to being a community &mdash; to weave your individual
          stories into a Shared Lore.
        </p>
      </div>
    </div>
  );
}
