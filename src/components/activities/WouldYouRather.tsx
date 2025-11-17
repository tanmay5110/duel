import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import PunishmentDisplay from '../ui/PunishmentDisplay';

interface WouldYouRatherProps {
  onComplete: () => void;
}

interface Question {
  id: string;
  description: string;
  optionA: string;
  optionB: string;
  difficulty: 'easy' | 'medium' | 'hard';
  activity: string;
  timer: number;
}

export default function WouldYouRather({ onComplete: _onComplete }: WouldYouRatherProps) {
  const { state, recordPunishment, switchTurn } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(state.currentTurn);

  const currentPlayer = state.players[state.currentTurn];

  // Monitor turn changes and refresh questions for new player's gender
  useEffect(() => {
    if (currentTurnPlayer !== state.currentTurn) {
      console.log('🔄 Would You Rather: Turn changed, loading new question for player', state.currentTurn);
      setCurrentTurnPlayer(state.currentTurn);
      setSelectedOption(null);
      setShowResult(false);
      setLoading(true);
    }
  }, [state.currentTurn, currentTurnPlayer]);

  // Load questions based on difficulty and current player's gender
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/data/punishments/${state.difficulty}/would-you-rather.json`);
        const data = await response.json();
        
        // Filter by current player's gender
        const genderSpecificQuestions = data.filter((q: Question) => {
          // Check if question has gender property, if not, include it for all
          return !(q as any).gender || (q as any).gender === currentPlayer.gender;
        });
        
        // Select random question
        const questionsToUse = genderSpecificQuestions.length > 0 ? genderSpecificQuestions : data;
        if (questionsToUse.length > 0) {
          const randomIndex = Math.floor(Math.random() * questionsToUse.length);
          setCurrentQuestion(questionsToUse[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [state.difficulty, currentPlayer.gender, state.currentTurn]);

  const handleOptionSelect = (option: 'A' | 'B') => {
    if (selectedOption) return; // Already selected
    
    setSelectedOption(option);
    
    // Record the choice
    const chosenOption = option === 'A' ? currentQuestion?.optionA : currentQuestion?.optionB;
    recordPunishment({
      activity: 'would-you-rather',
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      punishment: {
        id: Date.now(),
        description: chosenOption || '',
        gender: currentPlayer.gender,
        difficulty: state.difficulty,
        activity: 'would-you-rather',
        timer: currentQuestion?.timer || 0,
      },
      timestamp: Date.now()
    });

    // Show result after a moment
    setTimeout(() => {
      setShowResult(true);
    }, 800);
  };

  const handleComplete = () => {
    // Reset state and switch turn
    // The useEffect will automatically load new question for next player
    setSelectedOption(null);
    setShowResult(false);
    switchTurn();
  };

  const handleSkipTurn = () => {
    // Just switch turn, stay in activity
    // The useEffect will automatically load new question for next player
    switchTurn();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-thin text-white/60">Loading</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-thin text-white/60">No questions available</div>
      </div>
    );
  }

  if (showResult && selectedOption) {
    const chosenOption = selectedOption === 'A' ? currentQuestion.optionA : currentQuestion.optionB;
    return (
      <PunishmentDisplay
        punishment={{
          id: Date.now(),
          description: chosenOption,
          gender: currentPlayer.gender,
          difficulty: state.difficulty,
          activity: 'would-you-rather',
          timer: currentQuestion.timer || 0,
        }}
        playerName={currentPlayer.name}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto mt-4 md:mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
          <button
            onClick={_onComplete}
            className="px-4 md:px-6 py-2 md:py-3 border border-white/20 text-white/60 bg-transparent transition-all text-xs uppercase tracking-[0.2em] font-light self-start md:self-auto"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-2 md:mb-4">
              Would You Rather
            </h2>
            <p className="text-sm font-light text-white/60 mb-1 md:mb-2">
              {currentPlayer.name}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
              Choose One
            </p>
          </div>
          <div className="hidden md:block w-28"></div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Option A */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleOptionSelect('A')}
            disabled={selectedOption !== null}
            className={`p-6 md:p-12 border transition-all duration-300 text-left min-h-[200px] md:min-h-[300px] flex flex-col justify-between ${
              selectedOption === 'A'
                ? 'bg-white text-black border-white'
                : selectedOption === 'B'
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/20 text-white/60 bg-transparent'
            }`}
          >
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light mb-3 md:mb-6">
                Option A
              </div>
              <p className="text-lg md:text-2xl font-light leading-relaxed">
                {currentQuestion.optionA}
              </p>
            </div>
            {selectedOption === 'A' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-[0.2em] font-light mt-6"
              >
                Selected
              </motion.div>
            )}
          </motion.button>

          {/* Option B */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleOptionSelect('B')}
            disabled={selectedOption !== null}
            className={`p-6 md:p-12 border transition-all duration-300 text-left min-h-[200px] md:min-h-[300px] flex flex-col justify-between ${
              selectedOption === 'B'
                ? 'bg-white text-black border-white'
                : selectedOption === 'A'
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/20 text-white/60 bg-transparent'
            }`}
          >
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light mb-3 md:mb-6">
                Option B
              </div>
              <p className="text-lg md:text-2xl font-light leading-relaxed">
                {currentQuestion.optionB}
              </p>
            </div>
            {selectedOption === 'B' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-[0.2em] font-light mt-6"
              >
                Selected
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Skip Button */}
        {!selectedOption && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSkipTurn}
            className="w-full py-3 md:py-4 border border-white/20 text-white/60 bg-transparent transition-all text-xs uppercase tracking-[0.2em] font-light"
          >
            Skip to {state.players[(state.currentTurn + 1) % state.players.length].name}
          </motion.button>
        )}
      </div>
    </div>
  );
}
