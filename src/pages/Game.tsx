import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ActivityType } from '../types/game.types';
import { motion, AnimatePresence } from 'framer-motion';
import MiniGameSelector from '../components/activities/MiniGameSelector';
import TapBattle from '../components/activities/TapBattle';
import ReactionTest from '../components/activities/ReactionTest';
import TicTacToe from '../components/activities/TicTacToe';
import ScratchCard from '../components/activities/ScratchCard';
import SpinWheel from '../components/activities/SpinWheel';
import BodyExplorer from '../components/activities/BodyExplorer';
import Settings from '../components/ui/Settings';

type MiniGameType = 'tap-battle' | 'reaction-test' | 'tic-tac-toe';

export default function Game() {
  const navigate = useNavigate();
  const { state, setActivity, resetGame } = useGame();
    const [showActivitySelector, setShowActivitySelector] = useState(true);
  const [showMiniGameSelector, setShowMiniGameSelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [selectedMiniGame, setSelectedMiniGame] = useState<MiniGameType | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect to setup if no active game
  useEffect(() => {
    if (!state.isGameActive || state.players[0].name === '') {
      navigate('/', { replace: true });
    }
  }, [state.isGameActive, state.players, navigate]);

  const handleActivitySelect = (activity: ActivityType) => {    if (activity === 'mini-game') {
      // Show mini-game selector instead of going straight to game
      setShowMiniGameSelector(true);
      setShowActivitySelector(false);
    } else {
      setSelectedActivity(activity);
      setActivity(activity);
      setShowActivitySelector(false);
    }
  };

  const handleMiniGameSelect = (gameType: MiniGameType) => {    setSelectedMiniGame(gameType);
    setSelectedActivity('mini-game');
    setActivity('mini-game');
    setShowMiniGameSelector(false);
  };

  const handleBackToMiniGameSelector = () => {
    setSelectedMiniGame(null);
    setShowMiniGameSelector(true);
  };

  const handleBackToActivitySelector = () => {
    setShowMiniGameSelector(false);
    setShowActivitySelector(true);
    setSelectedActivity(null);
    setSelectedMiniGame(null);
  };

  const handleActivityComplete = () => {
    setShowActivitySelector(true);
    setShowMiniGameSelector(false);
    setSelectedActivity(null);
    setSelectedMiniGame(null);
  };

  const handleEndGame = () => {
    resetGame();
    navigate('/');
  };

  if (!state.isGameActive) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Minimal Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-16"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extralight tracking-tight uppercase text-white/90">
            DUEL
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 border border-white/20 hover:border-white/40 transition-all text-xs uppercase tracking-[0.2em] font-light"
            >
              Settings
            </button>
            <button
              onClick={handleEndGame}
              className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-[0.2em] font-light"
            >
              End
            </button>
          </div>
        </div>
      </motion.div>

      {/* Activity Selector or Active Activity */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {showActivitySelector ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <h2 className="text-6xl font-thin tracking-tight uppercase text-white/90 mb-4">
                  Choose
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-light">
                  Select Your Activity
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mini-Game */}
                <button
                  onClick={() => handleActivitySelect('mini-game')}
                  className="group border border-white/10 hover:border-white/30 transition-all duration-300 p-12 hover:bg-white/5"
                >
                  <div className="text-6xl font-thin tracking-tight uppercase text-white/80 mb-4">
                    Play
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                    Competitive Challenge
                  </div>
                </button>

                {/* Scratch Card */}
                <button
                  onClick={() => handleActivitySelect('scratch-card')}
                  className="group border border-white/10 hover:border-white/30 transition-all duration-300 p-12 hover:bg-white/5"
                >
                  <div className="text-6xl font-thin tracking-tight uppercase text-white/80 mb-4">
                    Scratch
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                    Reveal Your Fate
                  </div>
                </button>

                {/* Spin Wheel */}
                <button
                  onClick={() => handleActivitySelect('spin-wheel')}
                  className="group border border-white/10 hover:border-white/30 transition-all duration-300 p-12 hover:bg-white/5"
                >
                  <div className="text-6xl font-thin tracking-tight uppercase text-white/80 mb-4">
                    Spin
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                    Turn The Wheel
                  </div>
                </button>

                {/* Body Explorer */}
                <button
                  onClick={() => handleActivitySelect('body-explorer')}
                  className="group border border-white/10 hover:border-white/30 transition-all duration-300 p-12 hover:bg-white/5"
                >
                  <div className="text-6xl font-thin tracking-tight uppercase text-white/80 mb-4">
                    Explore
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                    Body Exploration
                  </div>
                </button>
              </div>
            </motion.div>
          ) : showMiniGameSelector ? (
            <MiniGameSelector
              onSelect={handleMiniGameSelect}
              onBack={handleBackToActivitySelector}
            />
          ) : (
            <motion.div
              key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedActivity === 'mini-game' && selectedMiniGame === 'tap-battle' && (
                <TapBattle onComplete={handleActivityComplete} onBack={handleBackToMiniGameSelector} />
              )}
              {selectedActivity === 'mini-game' && selectedMiniGame === 'reaction-test' && (
                <ReactionTest onComplete={handleActivityComplete} onBack={handleBackToMiniGameSelector} />
              )}
              {selectedActivity === 'mini-game' && selectedMiniGame === 'tic-tac-toe' && (
                <TicTacToe onComplete={handleActivityComplete} onBack={handleBackToMiniGameSelector} />
              )}
              {selectedActivity === 'scratch-card' && (
                <ScratchCard onComplete={handleActivityComplete} />
              )}
              {selectedActivity === 'spin-wheel' && (
                <SpinWheel onComplete={handleActivityComplete} />
              )}
              {selectedActivity === 'body-explorer' && (
                <BodyExplorer onComplete={handleActivityComplete} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
