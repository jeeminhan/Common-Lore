import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimerProps {
  secondsRemaining: number | null;
  totalSeconds: number;
  onExpire?: () => void;
}

export default function Timer({
  secondsRemaining,
  totalSeconds,
  onExpire,
}: TimerProps) {
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (secondsRemaining !== null && secondsRemaining <= 30) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }

    if (secondsRemaining === 0 && onExpire) {
      onExpire();
    }
  }, [secondsRemaining, onExpire]);

  if (secondsRemaining === null) return null;

  const progress = secondsRemaining / totalSeconds;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Circle parameters
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
      transition={isWarning ? { repeat: Infinity, duration: 1 } : {}}
    >
      {/* Background circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={isWarning ? 'text-hearts' : 'text-teal'}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-lg font-mono font-bold ${
            isWarning ? 'text-hearts' : 'text-white'
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Warning pulse effect */}
      {isWarning && secondsRemaining <= 10 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-hearts"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.div>
  );
}
