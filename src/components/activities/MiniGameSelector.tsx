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
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-6xl font-thin tracking-tight uppercase text-white/90">
            Play
          </h2>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tap Battle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => onSelect('tap-battle')}
            className="p-12 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-left"
          >
            <h3 className="text-4xl font-thin uppercase text-white/90 mb-3">Tap Battle</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Fastest Tapper Wins</p>
          </motion.button>

          {/* Reaction Test */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => onSelect('reaction-test')}
            className="p-12 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-left"
          >
            <h3 className="text-4xl font-thin uppercase text-white/90 mb-3">Reaction</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Click When Green</p>
          </motion.button>

          {/* Tic-Tac-Toe */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => onSelect('tic-tac-toe')}
            className="p-12 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-left md:col-span-2"
          >
            <h3 className="text-4xl font-thin uppercase text-white/90 mb-3">Tic-Tac-Toe</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Classic Strategy Game</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
