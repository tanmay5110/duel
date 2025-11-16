import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface ReactionTestProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function ReactionTest({ onBack }: ReactionTestProps) {
  const { state, recordPunishment } = useGame();
  const { getRandomPunishment } = usePunishments(state.difficulty, 'mini-game');
  
  const [gameState, setGameState] = useState<'instructions' | 'waiting' | 'ready' | 'clicked' | 'results' | 'punishment'>('instructions');
  const [player1Time, setPlayer1Time] = useState<number | null>(null);
  const [player2Time, setPlayer2Time] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [isTooEarly, setIsTooEarly] = useState(false);
  const [currentPunishment, setCurrentPunishment] = useState<any>(null);
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setGameState('waiting');
    setIsTooEarly(false);
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early!
      setIsTooEarly(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);      
      setTimeout(() => {
        if (currentPlayer === 0) {
          setCurrentPlayer(1);
          setIsTooEarly(false);
          setGameState('instructions');
        } else {
          // Both played, show results
          showResults();
        }
      }, 2000);
      
    } else if (gameState === 'ready') {
      // Calculate reaction time
      const reactionTime = Date.now() - startTimeRef.current;
      
      if (currentPlayer === 0) {
        setPlayer1Time(reactionTime);
        setCurrentPlayer(1);
        setGameState('clicked');        
        setTimeout(() => {
          setGameState('instructions');
        }, 1500);
        
      } else {
        setPlayer2Time(reactionTime);
        setGameState('clicked');        
        setTimeout(() => {
          showResults();
        }, 1500);
      }
    }
  };

  const showResults = () => {
    setGameState('results');
    // Determine loser (slower reaction or clicked too early)
    let loser: typeof state.players[0];
    
    if (player1Time === null) {
      loser = state.players[0]; // Player 1 clicked too early
    } else if (player2Time === null) {
      loser = state.players[1]; // Player 2 clicked too early
    } else {
      loser = player1Time > player2Time ? state.players[0] : state.players[1];
    }

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

      // Show punishment after delay
      setTimeout(() => {
        setGameState('punishment');
      }, 3000);
    }
  };

  const handlePunishmentComplete = () => {
    onBack(); // Go back to mini-game selector
  };

  if (gameState === 'punishment' && currentPunishment) {
    const loser = player1Time === null ? state.players[0] 
      : player2Time === null ? state.players[1]
      : player1Time > player2Time ? state.players[0] : state.players[1];
    
    return (
      <PunishmentDisplay
        punishment={currentPunishment}
        playerName={loser.name}
        onComplete={handlePunishmentComplete}
      />
    );
  }

  if (gameState === 'results') {
    const winner = player1Time === null ? state.players[1]
      : player2Time === null ? state.players[0]
      : player1Time < player2Time ? state.players[0] : state.players[1];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div className="w-full max-w-2xl">
          <h2 className="text-5xl font-thin tracking-tight uppercase text-white/90 mb-12 text-center">Results</h2>
          
          <div className="space-y-6 mb-12">
            <div className={`p-8 border transition-all ${
              player1Time !== null && player1Time < (player2Time || Infinity) 
                ? 'border-white bg-white/5' 
                : 'border-white/20'
            }`}>
              <div className="text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-3">{state.players[0].name}</div>
              <div className="text-4xl font-thin text-white/90">
                {player1Time !== null ? `${player1Time}ms` : 'Too Early'}
              </div>
            </div>
            
            <div className={`p-8 border transition-all ${
              player2Time !== null && player2Time < (player1Time || Infinity) 
                ? 'border-white bg-white/5' 
                : 'border-white/20'
            }`}>
              <div className="text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-3">{state.players[1].name}</div>
              <div className="text-4xl font-thin text-white/90">
                {player2Time !== null ? `${player2Time}ms` : 'Too Early'}
              </div>
            </div>
          </div>

          <div className="text-center py-8 border border-white/20">
            <div className="text-4xl font-thin uppercase tracking-tight text-white/90">{winner.name} Wins</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-thin tracking-tight uppercase text-white/90">Reaction</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
          >
            Back
          </button>
        </div>

        {gameState === 'instructions' && (
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-thin uppercase tracking-tight text-white/90 mb-8">
              {state.players[currentPlayer].name}'s Turn
            </h3>
            
            <div className="p-8 border border-white/10 space-y-4">
              <p className="text-sm uppercase tracking-[0.15em] text-white/60 font-light">Wait for green</p>
              <p className="text-sm uppercase tracking-[0.15em] text-white/60 font-light">Click as fast as you can</p>
              <p className="text-sm uppercase tracking-[0.15em] text-white/40 font-light">Don't click before green</p>
            </div>

            <button
              onClick={startTest}
              className="w-full py-8 bg-white text-black hover:bg-white/90 transition-all text-2xl font-thin uppercase tracking-tight"
            >
              Start
            </button>
          </div>
        )}

        {gameState === 'waiting' && !isTooEarly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClick}
            className="h-96 bg-black border-2 border-white/20 flex items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <div className="text-5xl font-thin mb-6 uppercase tracking-tight text-white/90">Wait</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Click when green</div>
            </div>
          </motion.div>
        )}

        {gameState === 'waiting' && isTooEarly && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
            className="h-96 border-2 border-white/40 bg-black flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-5xl font-thin mb-4 uppercase tracking-tight text-white/90">Too Early</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">You lose</div>
            </div>
          </motion.div>
        )}

        {gameState === 'ready' && (
          <motion.div
            initial={{ backgroundColor: '#000000', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            animate={{ backgroundColor: '#ffffff', borderColor: '#ffffff' }}
            onClick={handleClick}
            className="h-96 border-2 flex items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <div className="text-6xl font-thin uppercase tracking-tight text-black">Click</div>
            </div>
          </motion.div>
        )}

        {gameState === 'clicked' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-96 border-2 border-white/20 bg-black flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-5xl font-thin text-white/90 mb-4">
                {currentPlayer === 0 && player1Time !== null ? `${player1Time}ms` : 
                 currentPlayer === 1 && player2Time !== null ? `${player2Time}ms` : 'Recorded'}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Recorded</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
