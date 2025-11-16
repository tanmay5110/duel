import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface MiniGameProps {
  onComplete: () => void;
}

export default function MiniGame({ onComplete }: MiniGameProps) {
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
    if (gameState === 'playing') {
      setPlayer1Score(player1Score + 1);    }
  };

  const handlePlayer2Click = () => {
    if (gameState === 'playing') {
      setPlayer2Score(player2Score + 1);    }
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
    onComplete();
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
    <div className="card max-w-4xl mx-auto">
      <h2 className="section-title mb-6">Tap Battle!</h2>

      {/* Countdown */}
      {gameState === 'ready' && (
        <motion.div
          key={countdown}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          className="text-center py-20"
        >
          <p className="text-8xl font-bold text-yellow-400">{countdown || 'GO!'}</p>
          <p className="text-xl text-gray-400 mt-4">Tap your button as fast as you can!</p>
        </motion.div>
      )}

      {/* Playing State */}
      {(gameState === 'playing' || gameState === 'finished') && (
        <>
          {/* Timer */}
          <div className="text-center mb-6">
            <motion.p
              animate={{
                scale: gameTime <= 3 ? [1, 1.2, 1] : 1,
                color: gameTime <= 3 ? '#ef4444' : '#ffffff'
              }}
              transition={{ repeat: gameTime <= 3 ? Infinity : 0, duration: 1 }}
              className="text-6xl font-bold"
            >
              {gameTime}s
            </motion.p>
          </div>

          {/* Game Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Player 1 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayer1Click}
              disabled={gameState !== 'playing'}
              className={`h-64 rounded-xl text-white font-bold text-2xl transition-all ${
                state.players[0].gender === 'male' 
                  ? 'bg-male hover:bg-male-dark active:bg-male-light' 
                  : 'bg-female hover:bg-female-dark active:bg-female-light'
              } ${gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-5xl mb-4">
                {state.players[0].gender === 'male' ? '👨' : '👩'}
              </div>
              <div>{state.players[0].name}</div>
              <div className="text-6xl font-bold mt-4">{player1Score}</div>
            </motion.button>

            {/* Player 2 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayer2Click}
              disabled={gameState !== 'playing'}
              className={`h-64 rounded-xl text-white font-bold text-2xl transition-all ${
                state.players[1].gender === 'male' 
                  ? 'bg-male hover:bg-male-dark active:bg-male-light' 
                  : 'bg-female hover:bg-female-dark active:bg-female-light'
              } ${gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-5xl mb-4">
                {state.players[1].gender === 'male' ? '👨' : '👩'}
              </div>
              <div>{state.players[1].name}</div>
              <div className="text-6xl font-bold mt-4">{player2Score}</div>
            </motion.button>
          </div>

          {/* Winner Announcement */}
          {gameState === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              {player1Score === player2Score ? (
                <p className="text-4xl font-bold">It's a Tie! 🤝</p>
              ) : (
                <>
                  <p className="text-4xl font-bold mb-2">
                    <span className={
                      player1Score > player2Score 
                        ? (state.players[0].gender === 'male' ? 'text-male' : 'text-female')
                        : (state.players[1].gender === 'male' ? 'text-male' : 'text-female')
                    }>
                      {player1Score > player2Score ? state.players[0].name : state.players[1].name}
                    </span> Wins! 🎉
                  </p>
                  <p className="text-xl text-gray-400">
                    Preparing punishment...
                  </p>
                </>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
