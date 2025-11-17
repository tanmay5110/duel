import { motion } from 'framer-motion';

interface MiniGameSelectorProps {
  onSelect: (gameType: 'tap-battle' | 'reaction-test' | 'tic-tac-toe') => void;
  onBack: () => void;
}

export default function MiniGameSelector({ onSelect, onBack }: MiniGameSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <div className="w-full max-w-2xl mx-auto mt-4 md:mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
          <h2 className="text-3xl md:text-6xl font-thin tracking-tight uppercase text-white/90">
            Play
          </h2>
          <button
            onClick={onBack}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 text-white/60 bg-transparent transition-all text-xs uppercase tracking-[0.2em] font-light self-end md:self-auto"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {/* Tap Battle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => onSelect('tap-battle')}
            className="p-6 md:p-12 border border-white/20 text-white/60 bg-transparent transition-all duration-300 text-left"
          >
            <h3 className="text-2xl md:text-4xl font-thin uppercase mb-1 md:mb-3">Tap Battle</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">Fastest Tapper Wins</p>
          </motion.button>

          {/* Reaction Test */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => onSelect('reaction-test')}
            className="p-6 md:p-12 border border-white/20 text-white/60 bg-transparent transition-all duration-300 text-left"
          >
            <h3 className="text-2xl md:text-4xl font-thin uppercase mb-1 md:mb-3">Reaction</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">Click When Green</p>
          </motion.button>

          {/* Tic-Tac-Toe */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => onSelect('tic-tac-toe')}
            className="p-6 md:p-12 border border-white/20 text-white/60 bg-transparent transition-all duration-300 text-left md:col-span-2"
          >
            <h3 className="text-2xl md:text-4xl font-thin uppercase mb-1 md:mb-3">Tic-Tac-Toe</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">Classic Strategy Game</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
