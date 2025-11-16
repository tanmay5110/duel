import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Gender, Difficulty, Player } from '../types/game.types';
import { validatePlayerName, validateGenderPair, generateId } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function Setup() {
  const navigate = useNavigate();
  const { initializePlayers } = useGame();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Player 1 state
  const [player1Name, setPlayer1Name] = useState('');
  const [player1Gender, setPlayer1Gender] = useState<Gender | ''>('');
  
  // Player 2 state
  const [player2Name, setPlayer2Name] = useState('');
  const [player2Gender, setPlayer2Gender] = useState<Gender | ''>('');
  
  // Difficulty state
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  
  // Error states
  const [player1Error, setPlayer1Error] = useState('');
  const [player2Error, setPlayer2Error] = useState('');
  const [genderError, setGenderError] = useState('');

  const handlePlayer1Submit = () => {
    const nameValidation = validatePlayerName(player1Name);
    
    if (!nameValidation.valid) {
      setPlayer1Error(nameValidation.error || 'Invalid name');
      return;
    }
    
    if (!player1Gender) {
      setPlayer1Error('Please select a gender');
      return;
    }
    
    setPlayer1Error('');
    setStep(2);
  };

  const handlePlayer2Submit = () => {
    const nameValidation = validatePlayerName(player2Name);
    
    if (!nameValidation.valid) {
      setPlayer2Error(nameValidation.error || 'Invalid name');
      return;
    }
    
    if (!player2Gender) {
      setPlayer2Error('Please select a gender');
      return;
    }
    
    // Validate gender pair
    if (player1Gender && player2Gender) {
      const genderValidation = validateGenderPair(player1Gender, player2Gender);
      if (!genderValidation.valid) {
        setGenderError(genderValidation.error || 'Invalid gender pair');
        return;
      }
    }
    
    setPlayer2Error('');
    setGenderError('');
    setStep(3);
  };

  const handleStartGame = () => {
    if (!player1Gender || !player2Gender) return;

    const player1: Player = {
      id: generateId(),
      name: player1Name.trim(),
      gender: player1Gender
    };

    const player2: Player = {
      id: generateId(),
      name: player2Name.trim(),
      gender: player2Gender
    };

    initializePlayers(player1, player2, difficulty);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        {/* Logo - Minimalist */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-8xl font-extralight tracking-tight text-white mb-4">
            DUEL
          </h1>
          <p className="text-sm font-light tracking-[0.3em] text-white/40 uppercase">
            For Two
          </p>
        </motion.div>

        {/* Progress - Minimal dots */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-[2px] transition-all duration-500 ${
                num === step
                  ? 'w-12 bg-white'
                  : num < step
                  ? 'w-8 bg-white/40'
                  : 'w-6 bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Player 1 Setup */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-6xl font-thin tracking-tight text-white/90 uppercase">
                  Player One
                </h2>
              </div>
              
              <input
                type="text"
                placeholder="YOUR NAME"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="input-field text-center"
                maxLength={20}
                autoFocus
              />

              <div className="grid grid-cols-2 gap-4 mt-12">
                <button
                  onClick={() => setPlayer1Gender('male')}
                  className={`py-8 border transition-all duration-300 ${
                    player1Gender === 'male'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-3xl mb-2">♂</div>
                  <div className="text-xs font-light tracking-[0.2em] uppercase">Him</div>
                </button>
                
                <button
                  onClick={() => setPlayer1Gender('female')}
                  className={`py-8 border transition-all duration-300 ${
                    player1Gender === 'female'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-3xl mb-2">♀</div>
                  <div className="text-xs font-light tracking-[0.2em] uppercase">Her</div>
                </button>
              </div>

              {player1Error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500/80 text-xs text-center font-light tracking-wider uppercase"
                >
                  {player1Error}
                </motion.p>
              )}

              <button
                onClick={handlePlayer1Submit}
                className="btn-accent w-full mt-12"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Player 2 Setup */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-6xl font-thin tracking-tight text-white/90 uppercase">
                  Player Two
                </h2>
              </div>
              
              <input
                type="text"
                placeholder="YOUR NAME"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="input-field text-center"
                maxLength={20}
                autoFocus
              />

              <div className="grid grid-cols-2 gap-4 mt-12">
                <button
                  onClick={() => setPlayer2Gender('male')}
                  disabled={player1Gender === 'male'}
                  className={`py-8 border transition-all duration-300 ${
                    player2Gender === 'male'
                      ? 'bg-white text-black border-white'
                      : player1Gender === 'male'
                      ? 'bg-transparent text-white/10 border-white/5 cursor-not-allowed'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-3xl mb-2">♂</div>
                  <div className="text-xs font-light tracking-[0.2em] uppercase">Him</div>
                </button>
                
                <button
                  onClick={() => setPlayer2Gender('female')}
                  disabled={player1Gender === 'female'}
                  className={`py-8 border transition-all duration-300 ${
                    player2Gender === 'female'
                      ? 'bg-white text-black border-white'
                      : player1Gender === 'female'
                      ? 'bg-transparent text-white/10 border-white/5 cursor-not-allowed'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-3xl mb-2">♀</div>
                  <div className="text-xs font-light tracking-[0.2em] uppercase">Her</div>
                </button>
              </div>

              {(player2Error || genderError) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500/80 text-xs text-center font-light tracking-wider uppercase"
                >
                  {player2Error || genderError}
                </motion.p>
              )}

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => setStep(1)}
                  className="btn-primary flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handlePlayer2Submit}
                  className="btn-accent flex-1"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Difficulty Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-6xl font-thin tracking-tight text-white/90 uppercase mb-4">
                  Intensity
                </h2>
                <p className="text-xs font-light tracking-[0.3em] text-white/40 uppercase">
                  Choose Your Level
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setDifficulty('easy')}
                  className={`w-full py-10 border transition-all duration-300 ${
                    difficulty === 'easy'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-4xl font-thin tracking-tight uppercase">Gentle</div>
                  <div className="text-xs font-light tracking-[0.2em] text-current/60 uppercase mt-2">
                    Sweet & Playful
                  </div>
                </button>
                
                <button
                  onClick={() => setDifficulty('medium')}
                  className={`w-full py-10 border transition-all duration-300 ${
                    difficulty === 'medium'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-4xl font-thin tracking-tight uppercase">Teasing</div>
                  <div className="text-xs font-light tracking-[0.2em] text-current/60 uppercase mt-2">
                    Flirty & Fun
                  </div>
                </button>
                
                <button
                  onClick={() => setDifficulty('hard')}
                  className={`w-full py-10 border transition-all duration-300 ${
                    difficulty === 'hard'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="text-4xl font-thin tracking-tight uppercase">Passionate</div>
                  <div className="text-xs font-light tracking-[0.2em] text-current/60 uppercase mt-2">
                    Daring & Bold
                  </div>
                </button>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleStartGame}
                  className="btn-accent flex-1"
                >
                  Begin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
