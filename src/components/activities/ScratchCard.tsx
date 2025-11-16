import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface ScratchCardProps {
  onComplete: () => void;
}

interface CardState {
  punishment: any;
  isScratched: boolean;
}

export default function ScratchCard({ onComplete }: ScratchCardProps) {
  const { state, recordPunishment, switchTurn } = useGame();
  const { punishments, loading } = usePunishments(state.difficulty, 'scratch-card');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPunishment, setShowPunishment] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Card deck with scratched state
  const [cards, setCards] = useState<CardState[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(state.difficulty);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(state.currentTurn);

  const currentPlayer = state.players[state.currentTurn];
  const currentCard = selectedCardIndex !== null ? cards[selectedCardIndex] : null;

  // Monitor difficulty changes and force reset
  useEffect(() => {
    if (currentDifficulty !== state.difficulty) {
      console.log('🔄 CARDS DIFFICULTY CHANGED:', currentDifficulty, '→', state.difficulty);
      setCurrentDifficulty(state.difficulty);
      setCards([]); // Force reset
      setSelectedCardIndex(null);
      setShowPunishment(false);
      setIsRevealed(false);
      setScratchPercentage(0);
    }
  }, [state.difficulty, currentDifficulty]);

  // Monitor turn changes and refresh cards for new player's gender
  useEffect(() => {
    if (currentTurnPlayer !== state.currentTurn) {
      console.log('🔄 CARDS TURN CHANGED: Player', currentTurnPlayer, '→', state.currentTurn);
      console.log('New player gender:', state.players[state.currentTurn].gender);
      setCurrentTurnPlayer(state.currentTurn);
      setCards([]); // Force reset for new gender
      setSelectedCardIndex(null);
      setShowPunishment(false);
      setIsRevealed(false);
      setScratchPercentage(0);
    }
  }, [state.currentTurn, currentTurnPlayer, state.players]);

  // Initialize deck of 10 cards on mount OR when difficulty changes
  useEffect(() => {
    if (loading) {
      console.log('⏳ Cards: Still loading punishments...');
      return;
    }
    
    if (punishments.length === 0) {
      console.log('⚠️ Cards: No punishments loaded yet');
      return;
    }
    
    const playerPunishments = punishments.filter(p => p.gender === currentPlayer.gender);
    
    if (playerPunishments.length === 0) {
      console.log('⚠️ Cards: No punishments for gender:', currentPlayer.gender);
      return;
    }
    
    // Only init if cards are empty
    if (cards.length === 0) {
      console.log('🎯 Cards: Loading 10 cards for difficulty:', state.difficulty);
      
      const newCards: CardState[] = [];
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * playerPunishments.length);
        newCards.push({
          punishment: playerPunishments[randomIndex],
          isScratched: false
        });
      }
      
      console.log('✅ Cards loaded with punishments:', newCards.map(c => ({ id: c.punishment.id, difficulty: c.punishment.difficulty })));
      
      setCards(newCards);
    }
  }, [loading, punishments, currentPlayer.gender, state.difficulty, cards.length]);

  // Initialize canvas
  useEffect(() => {
    if (loading || isInitialized || !currentCard || selectedCardIndex === null) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#999999';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 20,
        Math.random() * 20
      );
    }

    ctx.fillStyle = '#555555';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

    setIsInitialized(true);
  }, [loading, isInitialized, currentCard, selectedCardIndex]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratch percentage
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isRevealed) {      setIsRevealed(true);
      // Clear the entire canvas to fully reveal
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 300);
      
      // Automatically record and show punishment after reveal
      setTimeout(() => {
        if (currentCard) {
          recordPunishment({
            activity: 'scratch-card',
            playerId: currentPlayer.id,
            playerName: currentPlayer.name,
            punishment: currentCard.punishment,
            timestamp: Date.now()
          });
          setShowPunishment(true);
        }
      }, 1000);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    e.preventDefault();
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect && touch) {
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect && touch) {
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  const handlePunishmentComplete = () => {
    if (selectedCardIndex === null) return;
    
    // Mark card as scratched
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[selectedCardIndex] = {
        ...newCards[selectedCardIndex],
        isScratched: true
      };
      console.log('Card marked as scratched:', selectedCardIndex);
      return newCards;
    });
    
    // Reset scratch view
    setSelectedCardIndex(null);
    setShowPunishment(false);
    setIsRevealed(false);
    setScratchPercentage(0);
    setIsInitialized(false);
    
    // Check if all cards are scratched
    const allScratched = cards.filter(c => c.isScratched).length + 1 >= cards.length;
    
    if (allScratched) {
      switchTurn();
      onComplete();
    } else {
      switchTurn();
    }
  };

  const handleCardSelect = (index: number) => {
    if (cards[index].isScratched) return;
    console.log('Selected card:', index);
    setSelectedCardIndex(index);
    setIsRevealed(false);
    setScratchPercentage(0);
    setIsInitialized(false);
  };

  const handleSkipTurn = () => {
    console.log('⏭️ Skipping turn - switching to next player');
    // Just switch turn without completing punishment
    // The turn change will trigger cards refresh automatically
    setShowPunishment(false);
    setSelectedCardIndex(null);
    setIsRevealed(false);
    setScratchPercentage(0);
    switchTurn();
  };

  if (showPunishment && currentCard) {
    return (
      <PunishmentDisplay
        punishment={currentCard.punishment}
        playerName={currentPlayer.name}
        onComplete={handlePunishmentComplete}
      />
    );
  }

  // Show card selection carousel
  if (selectedCardIndex === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={onComplete}
              className="px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
            <div className="text-center">
              <h2 className="text-6xl font-thin tracking-tight uppercase text-white/90 mb-2">Scratch</h2>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                  {currentPlayer.name}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                  {state.difficulty}
                </span>
              </div>
            </div>
            <div className="w-28"></div>
          </div>

          {loading || cards.length === 0 ? (
            <div className="text-center py-20 border border-white/10">
              <p className="text-2xl font-thin text-white/60">Loading</p>
            </div>
          ) : (
            <>
              {/* Vertical Card Stack */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                {cards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    whileHover={!card.isScratched ? { scale: 1.01 } : {}}
                    whileTap={!card.isScratched ? { scale: 0.99 } : {}}
                    onClick={() => handleCardSelect(index)}
                    className={`w-full h-64 border transition-all ${
                      card.isScratched
                        ? 'border-white/40 bg-white/5 cursor-default'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5 cursor-pointer'
                    }`}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      {card.isScratched ? (
                        <>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-4">
                            Revealed
                          </p>
                          <p className="text-base font-light text-white/80 leading-relaxed">
                            {card.punishment.description}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-6xl font-thin text-white/90 mb-6">
                            {index + 1}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                            Tap to Scratch
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-white/30 text-xs uppercase tracking-[0.2em] mt-6 mb-6 font-light">
                Scroll for More
              </p>

              {/* Skip Turn Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleSkipTurn}
                className="w-full py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
              >
                Skip to {state.players[(state.currentTurn + 1) % state.players.length].name}
              </motion.button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show scratch card view
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => {
              setSelectedCardIndex(null);
              setIsInitialized(false);
            }}
            className="px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-5xl font-thin tracking-tight uppercase text-white/90">Card {selectedCardIndex !== null ? selectedCardIndex + 1 : '?'}</h2>
          </div>
          <div className="w-28"></div>
        </div>
        
        {loading && cards.length === 0 ? (
          <div className="text-center py-20 border border-white/10">
            <p className="text-2xl font-thin text-white/60">Loading</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Scratch to Reveal</p>
            </div>

            {/* Scratch Card */}
            <div className="relative mb-8">
              {/* Hidden content (revealed punishment) */}
              <div className="absolute inset-0 border border-white/30 p-8 flex items-center justify-center bg-black">
                {currentCard ? (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.95 }}
                    className="text-xl font-light text-white/90 text-center leading-relaxed"
                  >
                    {currentCard.punishment.description}
                  </motion.p>
                ) : (
                  <p className="text-lg text-white/60 font-light">Loading...</p>
                )}
              </div>

              {/* Scratch overlay */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative w-full h-64 cursor-pointer touch-none"
                style={{ touchAction: 'none' }}
              />
            </div>

            {/* Progress bar */}
            {!isRevealed && (
              <div className="mb-8">
                <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-3">
                  <span>Progress</span>
                  <span>{Math.round(scratchPercentage)}%</span>
                </div>
                <div className="w-full border border-white/20 h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scratchPercentage}%` }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isRevealed && (
              <p className="text-center text-white/40 text-xs uppercase tracking-[0.2em] font-light">
                Scratch with Finger or Mouse
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
