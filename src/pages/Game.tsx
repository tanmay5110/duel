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
import WouldYouRather from '../components/activities/WouldYouRather';
import StripGame from '../components/activities/StripGame';
import Settings from '../components/ui/Settings';
import Header from '../components/ui/Header';

type MiniGameType = 'tap-battle' | 'reaction-test' | 'tic-tac-toe';

export default function Game() {
  const navigate = useNavigate();
  const { state, setActivity, resetGame } = useGame();
    const [showActivitySelector, setShowActivitySelector] = useState(true);
  const [showMiniGameSelector, setShowMiniGameSelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [selectedMiniGame, setSelectedMiniGame] = useState<MiniGameType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

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

  const handleHomeClick = () => {
    setShowActivitySelector(true);
    setShowMiniGameSelector(false);
    setSelectedActivity(null);
    setSelectedMiniGame(null);
  };

  const handleEndGameClick = () => {
    setShowEndGameConfirm(true);
  };

  const handleEndGameConfirm = () => {
    setShowEndGameConfirm(false);
    resetGame();
    navigate('/');
  };

  const handleEndGameCancel = () => {
    setShowEndGameConfirm(false);
  };

  if (!state.isGameActive) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* End Game Confirmation Modal */}
      <AnimatePresence>
        {showEndGameConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleEndGameCancel}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
            />

            {/* Confirmation Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-black border border-white/20 p-6 md:p-8 pointer-events-auto"
              >
                <h3 className="text-2xl md:text-3xl font-thin uppercase text-white/90 mb-4">
                  End Game?
                </h3>
                <p className="text-sm md:text-base text-white/60 font-light mb-6 md:mb-8">
                  Are you sure you want to end the game? All progress will be lost.
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={handleEndGameCancel}
                    className="py-3 md:py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/60 hover:text-white/90 transition-all text-sm uppercase tracking-[0.2em] font-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEndGameConfirm}
                    className="py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white transition-all text-sm uppercase tracking-[0.2em] font-light"
                  >
                    End Game
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Permanent Header */}
      <Header
        onHomeClick={handleHomeClick}
        onSettingsClick={() => setShowSettings(true)}
        onEndGame={handleEndGameClick}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {showActivitySelector ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-4 md:mb-8">
                <h2 className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-1 md:mb-2">
                  Choose
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-light">
                  Select Your Activity
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Mini-Game */}
                <button
                  onClick={() => handleActivitySelect('mini-game')}
                  className="group border border-white/20 hover:border-purple-400 text-white/60 hover:text-purple-300 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text group-hover:text-transparent transition-all">
                    Play
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">
                    Competitive Challenge
                  </div>
                </button>

                {/* Would You Rather */}
                <button
                  onClick={() => handleActivitySelect('would-you-rather')}
                  className="group border border-white/20 hover:border-cyan-400 text-white/60 hover:text-cyan-300 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text group-hover:text-transparent transition-all">
                    Choose
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">
                    Would You Rather
                  </div>
                </button>

                {/* Scratch Card */}
                <button
                  onClick={() => handleActivitySelect('scratch-card')}
                  className="group border border-white/20 hover:border-amber-400 text-white/60 hover:text-amber-300 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text group-hover:text-transparent transition-all">
                    Scratch
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">
                    Reveal Your Fate
                  </div>
                </button>

                {/* Spin Wheel */}
                <button
                  onClick={() => handleActivitySelect('spin-wheel')}
                  className="group border border-white/20 hover:border-green-400 text-white/60 hover:text-green-300 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text group-hover:text-transparent transition-all">
                    Spin
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">
                    Turn The Wheel
                  </div>
                </button>

                {/* Body Explorer */}
                <button
                  onClick={() => handleActivitySelect('body-explorer')}
                  className="group border border-white/20 hover:border-rose-400 text-white/60 hover:text-rose-300 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text group-hover:text-transparent transition-all">
                    Explore
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-current/60 font-light">
                    Body Exploration
                  </div>
                </button>

                {/* Strip Game */}
                <button
                  onClick={() => handleActivitySelect('strip-game')}
                  className="group border border-pink-400 hover:border-pink-300 text-pink-300 hover:text-pink-200 bg-transparent transition-all duration-300 p-8 md:p-12"
                >
                  <div className="text-4xl md:text-6xl font-thin tracking-tight uppercase mb-2 md:mb-4 bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-fuchsia-300 transition-all">
                    Strip
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-pink-200 font-light">
                    Sexy Challenge
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
              {selectedActivity === 'would-you-rather' && (
                <WouldYouRather onComplete={handleActivityComplete} />
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
              {selectedActivity === 'strip-game' && (
                <StripGame onComplete={handleActivityComplete} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
