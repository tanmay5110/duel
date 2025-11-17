import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface TapBattleProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function TapBattle({ onBack }: TapBattleProps) {
  const { state, recordPunishment } = useGame();
    const { getRandomPunishment } = usePunishments(state.difficulty, 'mini-game');
  
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished' | 'punishment'>('ready');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [gameTime, setGameTime] = useState(10);
  const [currentPunishment, setCurrentPunishment] = useState<any>(null);

  // Countdown before game starts
  useEffect(() => {
    if (gameState === 'ready' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'ready' && countdown === 0) {
      setGameState('playing');
    }
  }, [gameState, countdown]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && gameTime > 0) {
      const timer = setTimeout(() => setGameTime(gameTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && gameTime === 0) {
      handleGameEnd();
    }
  }, [gameState, gameTime]);

  const handlePlayer1Click = () => {
    if (gameState === 'playing') {      setPlayer1Score(player1Score + 1);
    }
  };

  const handlePlayer2Click = () => {
    if (gameState === 'playing') {      setPlayer2Score(player2Score + 1);
    }
  };

  const handleGameEnd = () => {
    setGameState('finished');
    // Determine loser (who gets punishment)
    const loser = player1Score > player2Score ? state.players[1] : state.players[0];

    // Get punishment for loser
    const punishment = getRandomPunishment(loser.gender);
    
    if (punishment) {
      setCurrentPunishment(punishment);

      // Record in history
      recordPunishment({
        activity: 'mini-game',
        playerId: loser.id,
        playerName: loser.name,
        punishment,
        timestamp: Date.now()
      });

      // Show punishment after a delay
      setTimeout(() => {
        setGameState('punishment');
      }, 2000);
    }
  };

  const handlePunishmentComplete = () => {
    onBack(); // Go back to mini-game selector
  };

  if (gameState === 'punishment' && currentPunishment) {
    const loser = player1Score > player2Score ? state.players[1] : state.players[0];
    return (
      <PunishmentDisplay
        punishment={currentPunishment}
        playerName={loser.name}
        onComplete={handlePunishmentComplete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8"
    >
      <div className="w-full max-w-4xl mx-auto mt-4 md:mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
          <h2 className="text-3xl md:text-5xl font-thin tracking-tight uppercase text-white/90">Tap Battle</h2>
          <button
            onClick={onBack}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-end md:self-auto"
          >
            Back
          </button>
        </div>

      {/* Countdown */}
      {gameState === 'ready' && countdown > 0 && (
        <motion.div
          key={countdown}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center py-16 md:py-32"
        >
          <div className="text-7xl md:text-9xl font-thin text-white/90">{countdown}</div>
        </motion.div>
      )}

      {/* Game in progress */}
      {(gameState === 'playing' || gameState === 'finished') && (
        <div className="space-y-4 md:space-y-8">
          {/* Timer */}
          <div className="text-center py-4 md:py-6 border-y border-white/10">
            <div className="text-5xl md:text-7xl font-thin text-white/90 mb-1 md:mb-2">{gameTime}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Seconds</div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="p-4 md:p-8 border border-white/10 text-center">
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-2 md:mb-4">{state.players[0].name}</div>
              <div className="text-4xl md:text-6xl font-thin text-white/90">{player1Score}</div>
            </div>
            
            <div className="p-4 md:p-8 border border-white/10 text-center">
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-2 md:mb-4">{state.players[1].name}</div>
              <div className="text-4xl md:text-6xl font-thin text-white/90">{player2Score}</div>
            </div>
          </div>

          {/* Tap Buttons */}
          {gameState === 'playing' && (
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <motion.button
                onClick={handlePlayer1Click}
                whileTap={{ scale: 0.97 }}
                className="h-32 md:h-48 bg-white text-black hover:bg-white/90 transition-all duration-150 text-2xl md:text-3xl font-thin uppercase tracking-tight"
              >
                Tap
              </motion.button>
              
              <motion.button
                onClick={handlePlayer2Click}
                whileTap={{ scale: 0.97 }}
                className="h-32 md:h-48 bg-white text-black hover:bg-white/90 transition-all duration-150 text-2xl md:text-3xl font-thin uppercase tracking-tight"
              >
                Tap
              </motion.button>
            </div>
          )}

          {/* Results */}
          {gameState === 'finished' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 md:py-12 border border-white/20"
            >
              <div className="text-3xl md:text-5xl font-thin text-white/90 mb-4 md:mb-6 uppercase tracking-tight">
                {player1Score > player2Score ? state.players[0].name : state.players[1].name} Wins
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/40 font-light">
                {player1Score > player2Score ? state.players[1].name : state.players[0].name} receives punishment
              </div>
            </motion.div>
          )}
        </div>
      )}
      </div>
    </motion.div>
  );
}
