import { motion } from 'framer-motion';

interface DeckStackProps {
  cardsRemaining: number;
  onDraw: () => void;
}

export default function DeckStack({ cardsRemaining, onDraw }: DeckStackProps) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onDraw}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shadow cards behind */}
      <div className="absolute w-48 h-72 bg-navy-800 rounded-2xl transform rotate-3 translate-x-2" />
      <div className="absolute w-48 h-72 bg-navy-800/80 rounded-2xl transform -rotate-2 -translate-x-1" />

      {/* Top card */}
      <div className="w-48 h-72 bg-navy-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center border border-teal/30 relative overflow-hidden">
        {/* Crossing lines pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 140"
          preserveAspectRatio="xMidYMid slice"
        >
          <line x1="10" y1="20" x2="90" y2="120" stroke="#0d9488" strokeWidth="2" opacity="0.3" />
          <line x1="90" y1="20" x2="10" y2="120" stroke="#0d9488" strokeWidth="2" opacity="0.3" />
          <line x1="15" y1="25" x2="85" y2="115" stroke="#d4a574" strokeWidth="1" opacity="0.2" />
          <line x1="85" y1="25" x2="15" y2="115" stroke="#d4a574" strokeWidth="1" opacity="0.2" />
        </svg>

        <div className="relative z-10 text-center">
          <svg
            className="w-8 h-8 text-teal mx-auto mb-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
            <polyline points="6 4 12 10 18 4" />
          </svg>
          <div className="font-serif text-gold tracking-[0.15em] text-sm mb-1">COMMON</div>
          <div className="font-serif text-gold tracking-[0.15em] text-sm">LORE</div>
          <div className="mt-4 text-gray-500 text-sm">{cardsRemaining} cards</div>
        </div>
      </div>
    </motion.div>
  );
}
