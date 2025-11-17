import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { usePunishments } from '../../hooks/usePunishments';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface SpinWheelProps {
  onComplete: () => void;
}

export default function SpinWheel({ onComplete }: SpinWheelProps) {
  const { state, recordPunishment, switchTurn } = useGame();
  const { punishments, loading } = usePunishments(state.difficulty, 'spin-wheel');
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState<any>(null);
  const [showPunishment, setShowPunishment] = useState(false);
  const [wheelPunishments, setWheelPunishments] = useState<any[]>([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(state.difficulty);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(state.currentTurn);
  const controls = useAnimation();

  const currentPlayer = state.players[state.currentTurn];
  
  // Monitor difficulty changes and force reset
  useEffect(() => {
    if (currentDifficulty !== state.difficulty) {
      console.log('🔄 DIFFICULTY CHANGED:', currentDifficulty, '→', state.difficulty);
      setCurrentDifficulty(state.difficulty);
      setWheelPunishments([]); // Force reset
      setSelectedPunishment(null);
      setShowPunishment(false);
      setCurrentRotation(0);
    }
  }, [state.difficulty, currentDifficulty]);

  // Monitor turn changes and refresh wheel for new player's gender
  useEffect(() => {
    if (currentTurnPlayer !== state.currentTurn) {
      console.log('🔄 TURN CHANGED: Player', currentTurnPlayer, '→', state.currentTurn);
      console.log('New player gender:', state.players[state.currentTurn].gender);
      setCurrentTurnPlayer(state.currentTurn);
      setWheelPunishments([]); // Force reset for new gender
      setSelectedPunishment(null);
      setShowPunishment(false);
      setCurrentRotation(0);
    }
  }, [state.currentTurn, currentTurnPlayer, state.players]);
  
  // Initialize wheel with 16 punishments (better visibility)
  useEffect(() => {
    if (loading) {
      console.log('⏳ Still loading punishments...');
      return;
    }
    
    if (punishments.length === 0) {
      console.log('⚠️ No punishments loaded yet');
      return;
    }
    
    console.log('=== WHEEL INIT DEBUG ===');
    console.log('Global difficulty:', state.difficulty);
    console.log('Total punishments loaded:', punishments.length);
    console.log('Sample punishment difficulties:', punishments.slice(0, 3).map(p => ({ id: p.id, difficulty: p.difficulty, desc: p.description })));
    
    const playerPunishments = punishments.filter(p => p.gender === currentPlayer.gender);
    console.log('Player punishments after gender filter:', playerPunishments.length);
    
    if (playerPunishments.length === 0) {
      console.log('⚠️ No punishments for gender:', currentPlayer.gender);
      return;
    }
    
    // Only init if wheel is empty
    if (wheelPunishments.length === 0) {
      console.log('🎯 Loading wheel with 16 punishments for difficulty:', state.difficulty);
      
      const selected: any[] = [];
      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * playerPunishments.length);
        selected.push(playerPunishments[randomIndex]);
      }
      
      console.log('✅ Wheel loaded with punishments:', selected.map(p => ({ id: p.id, difficulty: p.difficulty, desc: p.description.substring(0, 30) })));
      
      setWheelPunishments(selected);
    }
  }, [loading, punishments, currentPlayer.gender, state.difficulty, wheelPunishments.length]);

  const segmentAngle = 360 / Math.max(wheelPunishments.length, 1);

  const handleSpin = async () => {
    if (isSpinning || wheelPunishments.length === 0) return;    setIsSpinning(true);
    setSelectedPunishment(null);

    // Calculate target segment (random)
    const targetSegmentIndex = Math.floor(Math.random() * wheelPunishments.length);
    const segmentAngle = 360 / wheelPunishments.length;
    
    // Calculate rotation needed to land on target
    // We want the target segment to end up at the top (0 degrees where pointer is)
    const targetAngle = targetSegmentIndex * segmentAngle + (segmentAngle / 2);
    const spins = 3 + Math.floor(Math.random() * 3); // 3-5 full spins
    const totalRotation = currentRotation + (spins * 360) + (360 - targetAngle);

    console.log('Target segment:', targetSegmentIndex, 'Punishment:', wheelPunishments[targetSegmentIndex].description);
    console.log('Current rotation:', currentRotation, 'Total rotation:', totalRotation);

    // Animate wheel
    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4,
        ease: [0.17, 0.67, 0.23, 0.98]
      }
    });

    setCurrentRotation(totalRotation);
    const selected = wheelPunishments[targetSegmentIndex];
    
    console.log('Landed on:', selected.description);    setSelectedPunishment(selected);
    setIsSpinning(false);

    // Record punishment
    if (selected) {
      recordPunishment({
        activity: 'spin-wheel',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        punishment: selected,
        timestamp: Date.now()
      });

      setTimeout(() => {
        setShowPunishment(true);
      }, 2000);
    }
  };

  const handlePunishmentComplete = () => {
    if (!selectedPunishment) return;
    
    // Don't replace punishment - just switch turn
    // The turn change will trigger wheel refresh for new player's gender
    setSelectedPunishment(null);
    setShowPunishment(false);
    switchTurn();
  };

  const handleSkipTurn = () => {
    console.log('⏭️ Skipping turn - switching to next player');
    // Just switch turn without completing punishment
    // The turn change will trigger wheel refresh automatically
    setSelectedPunishment(null);
    setShowPunishment(false);
    switchTurn();
  };

  if (showPunishment && selectedPunishment) {
    return (
      <PunishmentDisplay
        punishment={selectedPunishment}
        playerName={currentPlayer.name}
        onComplete={handlePunishmentComplete}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto mt-4 md:mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
          <button
            onClick={onComplete}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-start md:self-auto"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-1 md:mb-2">Spin</h2>
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

        {/* Wheel Container */}
        <div className="relative w-full max-w-[280px] md:max-w-md mx-auto mb-6 md:mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-[2px] h-6 md:h-8 bg-white" />
          </div>

          {/* Wheel */}
          <motion.div
            animate={controls}
            className="relative w-full aspect-square border border-white/30 bg-black"
            style={{
              clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)'
            }}
          >
            {/* Segment lines */}
            {wheelPunishments.map((_, index) => {
              const angle = index * segmentAngle;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 origin-left h-[1px] bg-white/20"
                  style={{
                    width: '50%',
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
            
            {/* Segment task labels - spread across segment space */}
            {wheelPunishments.map((punishment, index) => {
              const angle = (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
              const radius = 38; // Moved outward for better space
              const x = 50 + radius * Math.cos(angle - Math.PI / 2);
              const y = 50 + radius * Math.sin(angle - Math.PI / 2);
              
              // Calculate rotation to align text with segment
              const textRotation = (index * segmentAngle) - 90;

              return (
                <div
                  key={`task-${index}`}
                  className="absolute text-white/80 font-light text-[6px] md:text-[7px] text-center leading-[1.1]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                    width: '55px',
                    textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,0.8)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {punishment.description.length > 35 
                    ? punishment.description.substring(0, 32) + '...' 
                    : punishment.description}
                </div>
              );
            })}

            {/* Center circle - thin border */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/30 bg-black flex items-center justify-center z-10">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Segment lines */}
            {wheelPunishments.map((_, index) => {
              const angle = index * segmentAngle;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 origin-left h-[1px] bg-white/20"
                  style={{
                    width: '50%',
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Spin Button and Skip Button */}
        {!isSpinning && !selectedPunishment && (
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleSpin}
              disabled={wheelPunishments.length === 0}
              className="w-full py-6 md:py-8 bg-white text-black hover:bg-white/90 transition-all duration-300 text-xl md:text-2xl font-thin uppercase tracking-tight disabled:opacity-30"
            >
              Spin
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={handleSkipTurn}
              className="w-full py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Skip to {state.players[(state.currentTurn + 1) % state.players.length].name}
            </motion.button>
          </div>
        )}

        {/* Spinning indicator */}
        {isSpinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-2xl md:text-3xl font-thin uppercase tracking-tight text-white/60 animate-pulse">Spinning</p>
          </motion.div>
        )}

        {/* Result announcement */}
        {selectedPunishment && !showPunishment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 space-y-2"
          >
            <p className="text-3xl md:text-4xl font-thin uppercase tracking-tight text-white/90">Landed</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">Preparing</p>
          </motion.div>
        )}

        {/* Wheel info */}
        <div className="text-center text-white/30 text-xs uppercase tracking-[0.2em] mt-6 font-light">
          <p>{wheelPunishments.length} Segments</p>
        </div>
      </div>
    </div>
  );
}
