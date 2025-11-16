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
    isActive,
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

  // Determine color based on time remaining
  const getColor = () => {
    if (percentage > 60) return 'text-green-500';
    if (percentage > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = () => {
    if (percentage > 60) return '#10b981'; // green-500
    if (percentage > 30) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

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
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            stroke={getStrokeColor()}
            strokeWidth="8"
            fill="transparent"
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
          <motion.span
            key={remainingSeconds}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-4xl font-bold ${getColor()}`}
          >
            {remainingSeconds}
          </motion.span>
        </div>
      </div>

      {/* Time text */}
      <motion.p
        animate={{
          scale: isActive && remainingSeconds <= 10 ? [1, 1.1, 1] : 1
        }}
        transition={{ repeat: isActive && remainingSeconds <= 10 ? Infinity : 0, duration: 1 }}
        className={`mt-4 text-lg font-semibold ${getColor()}`}
      >
        {formatTime()}
      </motion.p>

      {/* Urgency message */}
      {isActive && remainingSeconds <= 5 && remainingSeconds > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-red-500 font-bold animate-pulse"
        >
          Hurry up!
        </motion.p>
      )}
    </motion.div>
  );
}
