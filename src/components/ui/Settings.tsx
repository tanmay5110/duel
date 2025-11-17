import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Difficulty } from '../../types/game.types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const { state, changeDifficulty } = useGame();
  const [difficulty, setDifficulty] = useState<Difficulty>(state.difficulty);

  const handleDifficultyChange = (value: number) => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const newDifficulty = difficulties[value - 1];
    setDifficulty(newDifficulty);
    changeDifficulty(newDifficulty);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
          />

          {/* Settings Panel */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl glass-strong border border-white/20 overflow-y-auto max-h-[80vh] pointer-events-auto"
            >
              <div className="p-6 md:p-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <h2 className="text-3xl md:text-5xl font-thin tracking-tight uppercase text-white/90">
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all text-xl"
                >
                  ×
                </button>
              </div>

              {/* Difficulty Slider */}
              <div className="mb-8 md:mb-12">
              <label className="block text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 text-white/40 font-light">
                Intensity Level
              </label>
              <div className="space-y-3 md:space-y-4">
                <button
                  onClick={() => handleDifficultyChange(1)}
                  className={`w-full py-4 md:py-6 border transition-all duration-300 ${
                    difficulty === 'easy'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20'
                  }`}
                >
                  <div className="text-xl md:text-2xl font-thin uppercase">Gentle</div>
                </button>
                <button
                  onClick={() => handleDifficultyChange(2)}
                  className={`w-full py-4 md:py-6 border transition-all duration-300 ${
                    difficulty === 'medium'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20'
                  }`}
                >
                  <div className="text-xl md:text-2xl font-thin uppercase">Teasing</div>
                </button>
                <button
                  onClick={() => handleDifficultyChange(3)}
                  className={`w-full py-4 md:py-6 border transition-all duration-300 ${
                    difficulty === 'hard'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20'
                  }`}
                >
                  <div className="text-xl md:text-2xl font-thin uppercase">Passionate</div>
                </button>
              </div>
            </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-4 md:py-6 bg-white text-black border border-white transition-all text-xs uppercase tracking-[0.3em] font-light"
              >
                Done
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
