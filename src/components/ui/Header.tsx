import { motion } from 'framer-motion';

interface HeaderProps {
  onHomeClick: () => void;
  onSettingsClick: () => void;
  onEndGame: () => void;
  showRoundCounter?: boolean;
  currentRound?: number;
}

export default function Header({
  onHomeClick,
  onSettingsClick,
  onEndGame,
  showRoundCounter = false,
  currentRound = 0
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left: DUEL Logo */}
          <button
            onClick={onHomeClick}
            className="text-2xl md:text-4xl font-extralight tracking-tight uppercase text-white/90 hover:text-white transition-all hover:scale-105"
            aria-label="Return to activity selector"
          >
            DUEL
          </button>

          {/* Center: Round Counter (optional) */}
          {showRoundCounter && currentRound > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                Round
              </span>
              <span className="text-lg font-thin text-white/90">
                {currentRound}
              </span>
            </motion.div>
          )}

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onSettingsClick}
              className="px-3 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/60 hover:text-white/90 bg-transparent transition-all text-xs uppercase tracking-[0.2em] font-light"
              aria-label="Open settings"
            >
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">⚙️</span>
            </button>
            <button
              onClick={onEndGame}
              className="px-3 md:px-6 py-2 md:py-3 border border-white/20 hover:border-red-400 hover:bg-red-500/10 text-white/60 hover:text-red-400 bg-transparent transition-all text-xs uppercase tracking-[0.2em] font-light"
              aria-label="End game"
            >
              <span className="hidden sm:inline">End</span>
              <span className="sm:hidden">✕</span>
            </button>
          </div>
        </div>

        {/* Mobile Round Counter (below header) */}
        {showRoundCounter && currentRound > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden mt-2 text-center"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
              Round {currentRound}
            </span>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
