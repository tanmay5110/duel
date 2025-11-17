import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface TicTacToeProps {
  onComplete: () => void;
  onBack: () => void;
}

type Cell = 'X' | 'O' | null;
type Board = Cell[];

export default function TicTacToe({ onBack }: TicTacToeProps) {
  const { state, recordPunishment } = useGame();
  const { getRandomPunishment } = usePunishments(state.difficulty, 'mini-game');
  
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'finished' | 'punishment'>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [currentPunishment, setCurrentPunishment] = useState<any>(null);
  const [loserPlayer, setLoserPlayer] = useState<typeof state.players[0] | null>(null);

  // Player X is always player 0, Player O is always player 1
  const playerX = state.players[0];
  const playerO = state.players[1];

  const calculateWinner = (squares: Board): 'X' | 'O' | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as 'X' | 'O';
      }
    }

    // Check for draw
    if (squares.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameState !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    // Check for winner
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameState('finished');
      // Determine loser
      let loser: typeof state.players[0];
      
      if (result === 'draw') {
        // Random loser on draw
        loser = Math.random() < 0.5 ? playerX : playerO;
      } else if (result === 'X') {
        loser = playerO; // O loses
      } else {
        loser = playerX; // X loses
      }

      // Get punishment for loser
      const punishment = getRandomPunishment(loser.gender);
      
      if (punishment) {
        setCurrentPunishment(punishment);
        setLoserPlayer(loser);

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
        }, 2500);
      }
    }
  };

  const handlePunishmentComplete = () => {
    onBack(); // Go back to mini-game selector
  };

  if (gameState === 'punishment' && currentPunishment && loserPlayer) {
    return (
      <PunishmentDisplay
        punishment={currentPunishment}
        playerName={loserPlayer.name}
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
      <div className="w-full max-w-2xl mx-auto mt-4 md:mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
          <h2 className="text-3xl md:text-5xl font-thin tracking-tight uppercase text-white/90">Tic-Tac-Toe</h2>
          <button
            onClick={onBack}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-end md:self-auto"
          >
            Back
          </button>
        </div>

        {/* Player Indicators */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8">
          <div className={`p-4 md:p-6 border transition-all ${
            isXNext && gameState === 'playing' 
              ? 'border-white bg-white/5' 
              : 'border-white/20'
          }`}>
            <div className="text-center">
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-1 md:mb-2">{playerX.name}</div>
              <div className="text-3xl md:text-4xl font-thin text-white/90">X</div>
            </div>
          </div>
          
          <div className={`p-4 md:p-6 border transition-all ${
            !isXNext && gameState === 'playing' 
              ? 'border-white bg-white/5' 
              : 'border-white/20'
          }`}>
            <div className="text-center">
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-white/40 font-light mb-1 md:mb-2">{playerO.name}</div>
              <div className="text-3xl md:text-4xl font-thin text-white/90">O</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="w-full max-w-md mx-auto mb-4 md:mb-8">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                onClick={() => handleClick(index)}
                whileHover={{ scale: cell ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  aspect-square border flex items-center justify-center text-4xl md:text-5xl font-thin
                  transition-all
                  ${cell 
                    ? 'border-white/40 bg-white/5 cursor-default' 
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5 cursor-pointer'
                  }
                  ${gameState !== 'playing' ? 'cursor-not-allowed opacity-50' : ''}
                `}
                disabled={gameState !== 'playing' || cell !== null}
              >
                {cell === 'X' ? 'X' : cell === 'O' ? 'O' : ''}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Game Status */}
        {gameState === 'playing' && (
          <div className="text-center py-4 md:py-6 border-y border-white/10">
            <div className="text-xl md:text-2xl font-thin text-white/90">
              {isXNext ? 'X' : 'O'} • {isXNext ? playerX.name : playerO.name}
            </div>
          </div>
        )}

        {gameState === 'finished' && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 md:py-8 border border-white/20"
          >
            {winner === 'draw' ? (
              <>
                <div className="text-3xl md:text-4xl font-thin uppercase tracking-tight text-white/90 mb-2 md:mb-3">Draw</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Random loser chosen</div>
              </>
            ) : (
              <>
                <div className="text-3xl md:text-5xl font-thin uppercase tracking-tight text-white/90 mb-3 md:mb-4">
                  {winner === 'X' ? playerX.name : playerO.name} Wins
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                  {winner === 'X' ? playerO.name : playerX.name} receives punishment
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
