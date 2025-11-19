import { motion } from 'framer-motion';
import { Punishment } from '../../types/game.types';
import Timer from './Timer';

interface TaskDisplayProps {
  task: Punishment;
  onComplete: () => void;
}

export default function TaskDisplay({
  task,
  onComplete
}: TaskDisplayProps) {
  const hasTimer = task.timer && task.timer > 0;

  const handleComplete = () => {
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-6 md:mb-8"
          >
            Task Revealed
          </motion.h2>
          <div className="flex items-center justify-center gap-3 md:gap-4 text-xs uppercase tracking-[0.2em] text-white/40 font-light">
            <span className="px-3 md:px-4 py-2 border border-white/20">
              {task.difficulty}
            </span>
            <span className="px-3 md:px-4 py-2 border border-white/20">
              Scratch Card
            </span>
          </div>
        </div>

        {/* Task Content */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 md:p-12 border border-white/20 bg-black mb-6 md:mb-8"
        >
          <p className="text-lg md:text-2xl lg:text-3xl font-light text-center text-white/90 leading-relaxed">
            {task.description}
          </p>
        </motion.div>

        {/* Timer */}
        {hasTimer && (
          <div className="mb-6 md:mb-8">
            <Timer 
              seconds={task.timer!} 
              onComplete={onComplete}
              autoStart={true}
            />
          </div>
        )}

        {/* Complete Button (for non-timed tasks) */}
        {!hasTimer && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleComplete}
            className="w-full py-4 md:py-6 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
          >
            Complete
          </motion.button>
        )}

        {/* Skip Button (for timed tasks) */}
        {hasTimer && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleComplete}
            className="w-full py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light mt-4"
          >
            Skip
          </motion.button>
        )}

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-white/30 text-xs uppercase tracking-[0.2em] font-light mt-6"
        >
          {hasTimer 
            ? 'Complete Before Time Ends' 
            : 'Take Your Time'
          }
        </motion.p>
      </div>
    </motion.div>
  );
}
