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
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [timer, setTimer] = useState(true);

  const handleDifficultyChange = (value: number) => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const newDifficulty = difficulties[value - 1];
    setDifficulty(newDifficulty);
    changeDifficulty(newDifficulty);
  };

  const getDifficultyValue = (diff: Difficulty): number => {
    return diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
  };

  const getDifficultyLabel = (diff: Difficulty): string => {
    return diff === 'easy' ? '💚 Gentle' : diff === 'medium' ? '🧡 Teasing' : '❤️‍🔥 Passionate';
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-8 top-1/2 -translate-y-1/2 max-w-xl max-h-[80vh] mx-auto glass-strong border border-white/20 overflow-y-auto z-50"
          >
            <div className="p-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-5xl font-thin tracking-tight uppercase text-white/90">
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all text-xl"
                >
                  ×
                </button>
              </div>

              {/* Difficulty Slider */}
              <div className="mb-12">
              <label className="block text-xs uppercase tracking-[0.2em] mb-6 text-white/40 font-light">
                Intensity Level
              </label>
              <div className="space-y-4">
                <button
                  onClick={() => handleDifficultyChange(1)}
                  className={`w-full py-6 border transition-all duration-300 ${
                    difficulty === 'easy'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-thin uppercase">Gentle</div>
                </button>
                <button
                  onClick={() => handleDifficultyChange(2)}
                  className={`w-full py-6 border transition-all duration-300 ${
                    difficulty === 'medium'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-thin uppercase">Teasing</div>
                </button>
                <button
                  onClick={() => handleDifficultyChange(3)}
                  className={`w-full py-6 border transition-all duration-300 ${
                    difficulty === 'hard'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-thin uppercase">Passionate</div>
                </button>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-6 mb-12">
              {/* Vibration Toggle */}
              <div className="flex items-center justify-between p-6 border border-white/10">
                <div>
                  <p className="text-sm font-light uppercase tracking-[0.15em] text-white/90">Vibration</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-light mt-1">Haptic Feedback</p>
                </div>
                <button
                  onClick={() => setVibration(!vibration)}
                  className={`w-16 h-8 border transition-all duration-300 relative ${
                    vibration ? 'bg-white border-white' : 'bg-transparent border-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: vibration ? 32 : 0 }}
                    className={`absolute top-0 left-0 w-8 h-8 transition-colors ${
                      vibration ? 'bg-black' : 'bg-white/40'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-6 border border-white/10">
                <div>
                  <p className="text-sm font-light uppercase tracking-[0.15em] text-white/90">Sound</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-light mt-1">Audio Feedback</p>
                </div>
                <button
                  onClick={() => setSound(!sound)}
                  className={`w-16 h-8 border transition-all duration-300 relative ${
                    sound ? 'bg-white border-white' : 'bg-transparent border-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: sound ? 32 : 0 }}
                    className={`absolute top-0 left-0 w-8 h-8 transition-colors ${
                      sound ? 'bg-black' : 'bg-white/40'
                    }`}
                  />
                </button>
              </div>

              {/* Timer Toggle */}
              <div className="flex items-center justify-between p-6 border border-white/10">
                <div>
                  <p className="text-sm font-light uppercase tracking-[0.15em] text-white/90">Timers</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-light mt-1">Timed Challenges</p>
                </div>
                <button
                  onClick={() => setTimer(!timer)}
                  className={`w-16 h-8 border transition-all duration-300 relative ${
                    timer ? 'bg-white border-white' : 'bg-transparent border-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: timer ? 32 : 0 }}
                    className={`absolute top-0 left-0 w-8 h-8 transition-colors ${
                      timer ? 'bg-black' : 'bg-white/40'
                    }`}
                  />
                </button>
              </div>
            </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-4 bg-white text-black hover:bg-white/90 transition-all text-xs uppercase tracking-[0.3em] font-light"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
