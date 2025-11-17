import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';

interface TimerProps {
  seconds: number;
  onComplete: () => void;
  autoStart?: boolean;
}

export default function Timer({ seconds, onComplete, autoStart = true }: TimerProps) {
  const {
    seconds: remainingSeconds,
    start,
    formatTime
  } = useTimer(seconds, onComplete);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  // Calculate percentage for progress circle
  const percentage = (remainingSeconds / seconds) * 100;
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center justify-center"
    >
      {/* Circular Progress */}
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-white"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-thin text-white/90">
            {remainingSeconds}
          </span>
        </div>
      </div>

      {/* Time text */}
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40 font-light">
        {formatTime()}
      </p>
    </motion.div>
  );
}
