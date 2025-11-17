import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface BodyExplorerProps {
  onComplete: () => void;
}

type BodyPart = {
  id: string;
  name: string;
  description: string;
};

const bodyParts: BodyPart[] = [
  { id: 'lips', name: 'Lips', description: 'Kiss and explore the lips' },
  { id: 'neck', name: 'Neck', description: 'Kiss and caress the neck' },
  { id: 'ears', name: 'Ears', description: 'Nibble and whisper in the ears' },
  { id: 'shoulders', name: 'Shoulders', description: 'Massage and kiss the shoulders' },
  { id: 'chest', name: 'Chest', description: 'Touch and kiss the chest' },
  { id: 'back', name: 'Back', description: 'Massage and scratch the back' },
  { id: 'arms', name: 'Arms', description: 'Caress the arms' },
  { id: 'hands', name: 'Hands', description: 'Hold and massage the hands' },
  { id: 'waist', name: 'Waist', description: 'Touch and hold the waist' },
  { id: 'hips', name: 'Hips', description: 'Caress the hips' },
  { id: 'thighs', name: 'Thighs', description: 'Massage the thighs' },
  { id: 'legs', name: 'Legs', description: 'Caress the legs' },
  { id: 'feet', name: 'Feet', description: 'Massage the feet' },
];

export default function BodyExplorer({ onComplete }: BodyExplorerProps) {
  const { state, recordPunishment, switchTurn } = useGame();
      const [bodyPunishments, setBodyPunishments] = useState<any[]>([]);
  const [isLoadingPunishments, setIsLoadingPunishments] = useState(false);
  
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [selectedPunishment, setSelectedPunishment] = useState<any>(null);
  const [showPunishment, setShowPunishment] = useState(false);
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(state.currentTurn);

  const currentPlayer = state.players[state.currentTurn];
  const partnerGender = currentPlayer.gender === 'male' ? 'female' : 'male';

  // Load body explorer punishments
  useEffect(() => {
    const loadBodyPunishments = async () => {
      setIsLoadingPunishments(true);
      try {
        const response = await fetch(`/data/punishments/body-explorer/${partnerGender}.json`);
        const data = await response.json();
        setBodyPunishments(data);
      } catch (error) {
        console.error('Error loading body punishments:', error);
        setBodyPunishments([]);
      } finally {
        setIsLoadingPunishments(false);
      }
    };

    loadBodyPunishments();
  }, [partnerGender]);

  // Monitor turn changes and reset
  useEffect(() => {
    if (currentTurnPlayer !== state.currentTurn) {
      console.log('🔄 BODY EXPLORER TURN CHANGED');
      setCurrentTurnPlayer(state.currentTurn);
      setSelectedBodyPart(null);
      setSelectedPunishment(null);
      setShowPunishment(false);
      setIsSpinning(false);
      setBodyView('front');
    }
  }, [state.currentTurn, currentTurnPlayer]);

  const handleRandomSelect = () => {
    if (isSpinning) return;    setIsSpinning(true);
    console.log('🎲 Randomly selecting body part...');
    
    // Random animation
    let spins = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      const randomPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
      setSelectedBodyPart(randomPart);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        // Final selection
        const finalPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
        setSelectedBodyPart(finalPart);
        
        // Randomly choose front or back view
        const randomView = Math.random() > 0.5 ? 'front' : 'back';
        setBodyView(randomView);
        
        setTimeout(() => {
          selectPunishmentForBodyPart(finalPart);
          setIsSpinning(false);
        }, 500);
      }
    }, 100);
  };

  const selectPunishmentForBodyPart = (bodyPart: BodyPart) => {
    console.log('🎯 Selecting punishment for body part:', bodyPart.id);
    console.log('📚 Total punishments loaded:', bodyPunishments.length);
    
    // Filter punishments for this specific body part
    const bodyPartPunishments = bodyPunishments.filter(p => p.bodyPart === bodyPart.id);
    console.log('🎲 Found punishments for', bodyPart.id, ':', bodyPartPunishments.length);
    
    if (bodyPartPunishments.length > 0) {
      const randomIndex = Math.floor(Math.random() * bodyPartPunishments.length);
      const punishment = bodyPartPunishments[randomIndex];
      console.log('✅ Selected punishment:', punishment);
      
      setSelectedPunishment(punishment);
      
      // Record punishment
      recordPunishment({
        activity: 'body-explorer',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        punishment: punishment,
        timestamp: Date.now()
      });

      // Wait 2 seconds to show the body part before showing punishment
      setTimeout(() => {
        console.log('⏰ Now showing punishment display');
        setShowPunishment(true);
      }, 2000);
    } else {
      console.error('❌ No punishments found for body part:', bodyPart.id);
    }
  };

  const handlePunishmentComplete = () => {
    setSelectedBodyPart(null);
    setSelectedPunishment(null);
    setShowPunishment(false);
    setBodyView('front');
    switchTurn();
  };

  const handleSkipTurn = () => {
    console.log('⏭️ Skipping turn');
    setSelectedBodyPart(null);
    setSelectedPunishment(null);
    setShowPunishment(false);
    setBodyView('front');
    switchTurn();
  };

  if (isLoadingPunishments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-thin text-white/60">Loading</div>
      </div>
    );
  }

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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-4 md:gap-0">
          <button
            onClick={onComplete}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light self-start md:self-auto"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-1 md:mb-2">Body</h2>
            <div className="flex items-center gap-2 md:gap-3 justify-center">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                {currentPlayer.name}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                {partnerGender}
              </span>
            </div>
          </div>
          <div className="hidden md:block w-28"></div>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <p className="text-sm font-light text-white/60 mb-1">
            Random Selection
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
            Body Part on Partner
          </p>
        </div>

        {/* Body Display with Front/Back Toggle */}
        <div className="relative w-full max-w-lg mx-auto mb-6 md:mb-8">
          <div className="border border-white/10 p-4 md:p-8 relative">
            {/* View Toggle */}
            <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 justify-center">
              <button
                onClick={() => setBodyView('front')}
                disabled={isSpinning}
                className={`px-6 md:px-8 py-2 md:py-3 border transition-all text-xs uppercase tracking-[0.2em] font-light ${
                  bodyView === 'front' 
                    ? 'border-white bg-white text-black' 
                    : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setBodyView('back')}
                disabled={isSpinning}
                className={`px-6 md:px-8 py-2 md:py-3 border transition-all text-xs uppercase tracking-[0.2em] font-light ${
                  bodyView === 'back' 
                    ? 'border-white bg-white text-black' 
                    : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                Back
              </button>
            </div>

            {/* Body Outline Placeholder */}
            <div className="relative w-full aspect-[2/3] border border-white/20 bg-black flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.2em] font-light mb-6 md:mb-8">
                  {bodyView === 'front' ? 'Front View' : 'Back View'}
                </p>
                {selectedBodyPart && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 md:mt-6 border border-white/40 bg-white/5 px-8 md:px-12 py-4 md:py-6\"
                  >
                    <p className="text-white text-2xl md:text-4xl font-thin uppercase tracking-tight">
                      {selectedBodyPart.name}
                    </p>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-light mt-2 md:mt-3">
                      Selected
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Random Selection Button */}
        {!selectedPunishment && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={handleRandomSelect}
            disabled={isSpinning}
            className={`w-full py-6 border transition-all text-xs uppercase tracking-[0.2em] font-light mb-4 ${
              isSpinning
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            {isSpinning ? 'Selecting' : 'Random Selection'}
          </motion.button>
        )}

        {/* Skip Turn Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSkipTurn}
          disabled={isSpinning}
          className="w-full py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
        >
          Skip to {state.players[(state.currentTurn + 1) % state.players.length].name}
        </motion.button>

        {/* Available Body Parts List */}
        <div className="mt-8 border border-white/10 p-6">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-light text-center mb-4">Possible Parts</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {bodyParts.map((part) => (
              <span
                key={part.id}
                className={`px-4 py-2 border text-xs uppercase tracking-[0.2em] font-light transition-all ${
                  selectedBodyPart?.id === part.id
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 text-white/40'
                }`}
              >
                {part.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
