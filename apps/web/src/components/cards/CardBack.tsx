interface CardBackProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function CardBack({ size: _size = 'md' }: CardBackProps) {
  return (
    <div className="w-full h-full rounded-xl shadow-card overflow-hidden bg-navy-900 relative">
      {/* Outer border */}
      <div className="absolute inset-2 border border-gold/30 rounded-lg" />

      {/* Inner decorative frame */}
      <div className="absolute inset-4 border border-teal/20 rounded-md" />

      {/* Crossing lines pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 140"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Diagonal lines forming X pattern */}
        <line
          x1="10"
          y1="20"
          x2="90"
          y2="120"
          stroke="#0d9488"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="90"
          y1="20"
          x2="10"
          y2="120"
          stroke="#0d9488"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="15"
          y1="25"
          x2="85"
          y2="115"
          stroke="#d4a574"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="85"
          y1="25"
          x2="15"
          y2="115"
          stroke="#d4a574"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Additional accent lines */}
        <line
          x1="5"
          y1="30"
          x2="45"
          y2="70"
          stroke="#0d9488"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="95"
          y1="30"
          x2="55"
          y2="70"
          stroke="#0d9488"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="5"
          y1="110"
          x2="45"
          y2="70"
          stroke="#0d9488"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="95"
          y1="110"
          x2="55"
          y2="70"
          stroke="#0d9488"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </svg>

      {/* Center logo area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Chevron icon */}
        <svg
          className="w-6 h-6 text-teal mb-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 4 12 10 18 4" />
        </svg>

        {/* COMMON LORE text */}
        <div className="font-serif text-gold tracking-[0.15em] text-[10px] leading-tight text-center">
          COMMON<br />LORE
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-gold/40" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-gold/40" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-gold/40" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-gold/40" />
    </div>
  );
}
