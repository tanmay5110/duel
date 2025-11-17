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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPunishment, setShowPunishment] = useState(false);
  
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
      // Do NOT reset the deck on turn change; keep scratched state visible
      // Only reset the current scratch view state
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
    
    // Scratch card is gender-neutral - use all punishments
    if (punishments.length === 0) {
      console.log('⚠️ Cards: No punishments available');
      return;
    }
    
    // Only init if cards are empty
    if (cards.length === 0) {
      console.log('🎯 Cards: Loading 10 cards for difficulty:', state.difficulty);
      
      const newCards: CardState[] = [];
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * punishments.length);
        newCards.push({
          punishment: punishments[randomIndex],
          isScratched: false
        });
      }
      
      console.log('✅ Cards loaded:', newCards.length);
      
      setCards(newCards);
    }
  }, [loading, punishments, state.difficulty, cards.length]);

  // Initialize canvas when card is selected
  useEffect(() => {
    if (!currentCard || selectedCardIndex === null || loading) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Draw gray scratch overlay
    ctx.fillStyle = '#666666';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture
    ctx.fillStyle = '#888888';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 15 + 5,
        Math.random() * 15 + 5
      );
    }

    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(canvas.width / 15, 32)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

    console.log('✅ Canvas initialized:', canvas.width, 'x', canvas.height);
  }, [currentCard, selectedCardIndex, loading]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 50;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Check less frequently for better performance
    if (Math.random() < 0.3) {
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isRevealed) {
      setIsRevealed(true);
      console.log('🎉 Card revealed at', Math.round(percentage), '%');
      
      // Clear canvas
      setTimeout(() => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 200);
      
      // Show punishment
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
      }, 800);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    e.preventDefault();
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
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (rect && touch) {
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
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
    console.log('🎯 Punishment complete for card:', selectedCardIndex);
    if (selectedCardIndex === null) return;
    
    // Mark card as scratched FIRST
    const updatedCards = [...cards];
    updatedCards[selectedCardIndex] = {
      ...updatedCards[selectedCardIndex],
      isScratched: true
    };
    setCards(updatedCards);
    console.log('✅ Card marked as scratched:', selectedCardIndex);
    console.log('Updated cards:', updatedCards.map((c, i) => ({ index: i, scratched: c.isScratched })));
    
    // Reset scratch view
    setShowPunishment(false);
    setIsRevealed(false);
    setScratchPercentage(0);
    setSelectedCardIndex(null);
    
    // Check if all cards are scratched
    const scratchedCount = updatedCards.filter(c => c.isScratched).length;
    console.log(`📊 Scratched cards: ${scratchedCount}/${updatedCards.length}`);
    
    if (scratchedCount >= updatedCards.length) {
      console.log('🎉 All cards scratched! Ending activity...');
      switchTurn();
      onComplete();
    } else {
      switchTurn();
    }
  };

  const handleCardSelect = (index: number) => {
    if (cards[index].isScratched) return;
    console.log('🎴 Selected card:', index);
    setSelectedCardIndex(index);
    setIsRevealed(false);
    setScratchPercentage(0);
  };

  if (showPunishment && currentCard) {
    console.log('🎯 Showing punishment:', currentCard.punishment);
    console.log('Timer value:', currentCard.punishment.timer);
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
      <div className="p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto mt-4 md:mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
            <button
              onClick={onComplete}
              className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-start md:self-auto"
            >
              Back
            </button>
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-1 md:mb-2">Scratch</h2>
              <div className="flex items-center gap-2 md:gap-3 justify-center">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                  {currentPlayer.name}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                  {state.difficulty}
                </span>
              </div>
            </div>
            <div className="hidden md:block w-28"></div>
          </div>

          {loading || cards.length === 0 ? (
            <div className="text-center py-20 border border-white/10">
              <p className="text-2xl font-thin text-white/60">Loading</p>
            </div>
          ) : (
            <>
              {/* Card Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {cards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={!card.isScratched ? { scale: 1.03 } : {}}
                    whileTap={!card.isScratched ? { scale: 0.97 } : {}}
                    onClick={() => handleCardSelect(index)}
                    className={`aspect-[3/4] transition-all relative overflow-hidden ${
                      card.isScratched
                        ? 'border-2 border-green-500 bg-gradient-to-br from-green-900/30 to-green-800/20 cursor-default shadow-lg shadow-green-500/20'
                        : 'border border-white/20 hover:border-white/40 hover:bg-white/5 cursor-pointer'
                    }`}
                  >
                    {card.isScratched ? (
                      <div className="h-full w-full flex flex-col items-center justify-center p-3 text-center bg-black/40">
                        <div className="mb-auto pt-2">
                          <p className="text-[10px] uppercase tracking-wider text-green-400/80 font-medium">
                            CARD {index + 1}
                          </p>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center px-2">
                          <p className="text-sm md:text-base font-normal text-white drop-shadow-lg leading-snug">
                            {card.punishment.description}
                          </p>
                        </div>
                        
                        <div className="mt-auto pb-2 space-y-1">
                          {card.punishment.timer > 0 && (
                            <p className="text-xs text-white/80 font-medium">
                              ⏱ {card.punishment.timer}s
                            </p>
                          )}
                          <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold">
                            ✓ REVEALED
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-4xl md:text-5xl font-thin text-white/90 mb-3">
                          {index + 1}
                        </p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-light">
                          Scratch to Reveal
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show scratch card view
  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto mt-4 md:mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
          <button
            onClick={() => {
              setSelectedCardIndex(null);
            }}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-start md:self-auto"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight uppercase text-white/90">Card {selectedCardIndex !== null ? selectedCardIndex + 1 : '?'}</h2>
          </div>
          <div className="hidden md:block w-28"></div>
        </div>
        
        {loading && cards.length === 0 ? (
          <div className="text-center py-20 border border-white/10">
            <p className="text-2xl font-thin text-white/60">Loading</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Scratch to Reveal</p>
            </div>

            {/* Scratch Card */}
            <div 
              ref={containerRef}
              className="relative mb-6 md:mb-8 w-full h-64 md:h-80 border-2 border-white/30 overflow-hidden bg-black"
            >
              {/* Hidden content (revealed punishment) - z-0 */}
              <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center z-0">
                {currentCard ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isRevealed ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-base md:text-xl font-light text-white text-center leading-relaxed"
                  >
                    {currentCard.punishment.description}
                  </motion.p>
                ) : (
                  <p className="text-sm md:text-lg text-white/60 font-light">Loading...</p>
                )}
              </div>

              {/* Scratch overlay canvas - z-10 on top */}
              {!isRevealed && (
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  style={{ touchAction: 'none' }}
                />
              )}
            </div>

            {/* Progress bar */}
            {!isRevealed && (
              <div className="mb-6 md:mb-8">
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
