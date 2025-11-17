import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

interface StripGameProps {
  onComplete: () => void;
}

interface ClothingItem {
  id: string;
  name: string;
  isPermanent: boolean;
}

interface Task {
  id: number;
  text: string;
  type?: 'regular' | 'double';
  timer?: number;
}

type Phase = 'setup' | 'task' | 'winner' | 'reward' | 'gamble' | 'removal' | 'gameover';
type TaskCategory = 'male' | 'female' | 'both';

const PRELOADED_MALE_ITEMS: ClothingItem[] = [
  { id: 'm1', name: 'Watch', isPermanent: false },
  { id: 'm2', name: 'Shirt', isPermanent: false },
  { id: 'm3', name: 'Pants', isPermanent: false },
  { id: 'm4', name: 'Socks', isPermanent: false },
  { id: 'm5', name: 'Underwear', isPermanent: true }
];

const PRELOADED_FEMALE_ITEMS: ClothingItem[] = [
  { id: 'f1', name: 'Earrings', isPermanent: false },
  { id: 'f2', name: 'Bra', isPermanent: true },
  { id: 'f3', name: 'Top', isPermanent: false },
  { id: 'f4', name: 'Skirt', isPermanent: false },
  { id: 'f5', name: 'Stockings', isPermanent: false },
  { id: 'f6', name: 'Panties', isPermanent: true }
];

export default function StripGame({ onComplete }: StripGameProps) {
  const { state } = useGame();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [player1Items, setPlayer1Items] = useState<ClothingItem[]>([]);
  const [player2Items, setPlayer2Items] = useState<ClothingItem[]>([]);
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('both');
  const [commonTasks, setCommonTasks] = useState<Task[]>([]);
  const [maleTasks, setMaleTasks] = useState<Task[]>([]);
  const [femaleTasks, setFemaleTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [itemsToRemove, setItemsToRemove] = useState(1);
  const [roundCount, setRoundCount] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gamblingPlayer, setGamblingPlayer] = useState<0 | 1 | null>(null);
  const [originalWinner, setOriginalWinner] = useState<0 | 1 | null>(null);
  const [removedItemName, setRemovedItemName] = useState<string>('');
  const [isGambleFail, setIsGambleFail] = useState(false);

  const player1 = state.players[0];
  const player2 = state.players[1];

  // Load tasks from JSON
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const [commonRes, maleRes, femaleRes] = await Promise.all([
          fetch('/data/strip/strip-common-tasks.json'),
          fetch('/data/strip/strip-male.json'),
          fetch('/data/strip/strip-female.json')
        ]);
        
        setCommonTasks(await commonRes.json());
        setMaleTasks(await maleRes.json());
        setFemaleTasks(await femaleRes.json());
      } catch (error) {
        console.error('Failed to load strip tasks:', error);
      }
    };
    
    loadTasks();
  }, []);

  // Initialize clothing items
  useEffect(() => {
    if (phase === 'setup' && player1Items.length === 0) {
      setPlayer1Items(
        player1.gender === 'male' 
          ? [...PRELOADED_MALE_ITEMS] 
          : [...PRELOADED_FEMALE_ITEMS]
      );
      setPlayer2Items(
        player2.gender === 'male' 
          ? [...PRELOADED_MALE_ITEMS] 
          : [...PRELOADED_FEMALE_ITEMS]
      );
    }
  }, [phase, player1.gender, player2.gender, player1Items.length]);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (phase === 'gamble' && gamblingPlayer !== null) {
        // Time's up on gamble - they failed
        handleGambleFail();
      } else if (phase === 'task') {
        // Time's up on regular task - both players failed, no winner
        // Determine who loses based on task category
        handleTimerExpired();
      }
    }
  }, [isTimerRunning, timer, phase, gamblingPlayer]);

  const handleMoveItemUp = (playerIndex: 0 | 1, itemIndex: number) => {
    if (itemIndex === 0) return;
    const items = playerIndex === 0 ? [...player1Items] : [...player2Items];
    [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
    playerIndex === 0 ? setPlayer1Items(items) : setPlayer2Items(items);
  };

  const handleMoveItemDown = (playerIndex: 0 | 1, itemIndex: number) => {
    const items = playerIndex === 0 ? [...player1Items] : [...player2Items];
    if (itemIndex === items.length - 1) return;
    [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]];
    playerIndex === 0 ? setPlayer1Items(items) : setPlayer2Items(items);
  };

  const handleDeleteItem = (playerIndex: 0 | 1, itemIndex: number) => {
    const items = playerIndex === 0 ? [...player1Items] : [...player2Items];
    if (items[itemIndex].isPermanent) return;
    items.splice(itemIndex, 1);
    playerIndex === 0 ? setPlayer1Items(items) : setPlayer2Items(items);
  };

  const handleAddItem = (playerIndex: 0 | 1, itemName: string) => {
    if (!itemName.trim()) return;
    const items = playerIndex === 0 ? [...player1Items] : [...player2Items];
    const newItem: ClothingItem = {
      id: `custom-${Date.now()}`,
      name: itemName.trim(),
      isPermanent: false
    };
    items.splice(items.length - (items.filter(i => i.isPermanent).length), 0, newItem);
    playerIndex === 0 ? setPlayer1Items(items) : setPlayer2Items(items);
  };

  const handleStartGame = () => {
    if (player1Items.length <= 1 || player2Items.length <= 1) {
      alert('Each player needs at least 2 items to start!');
      return;
    }
    setPhase('task');
    startNewRound();
  };

  const startNewRound = () => {
    setRoundCount(prev => prev + 1);
    setWinner(null);
    setOriginalWinner(null);
    setItemsToRemove(1);
    setGamblingPlayer(null);
    setRemovedItemName('');
    setIsGambleFail(false);
    
    // Auto-cycle through categories: male → female → both
    const categories: TaskCategory[] = ['male', 'female', 'both'];
    const currentIndex = categories.indexOf(taskCategory);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    setTaskCategory(nextCategory);
    
    // Load tasks based on category
    let tasks: Task[] = [];
    if (nextCategory === 'both') {
      tasks = commonTasks.filter(t => t.type === 'regular' || !t.type);
    } else if (nextCategory === 'male') {
      tasks = maleTasks.filter(t => t.type === 'regular' || !t.type);
    } else if (nextCategory === 'female') {
      tasks = femaleTasks.filter(t => t.type === 'regular' || !t.type);
    }
    
    if (tasks.length > 0) {
      const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
      setCurrentTask(selectedTask);
      setTimer(selectedTask.timer || 60);
      setIsTimerRunning(true);
    }
  };

  const handlePlayerFinished = (playerIndex: 0 | 1) => {
    setIsTimerRunning(false);
    setWinner(playerIndex);
    setPhase('winner');
    
    setTimeout(() => {
      setPhase('reward');
    }, 1000);
  };

  const handleTimerExpired = () => {
    // Determine loser based on task category
    let loserIndex: 0 | 1;
    
    if (taskCategory === 'male') {
      // Male player was supposed to perform, they failed
      loserIndex = player1.gender === 'male' ? 0 : 1;
    } else if (taskCategory === 'female') {
      // Female player was supposed to perform, they failed
      loserIndex = player1.gender === 'female' ? 0 : 1;
    } else {
      // Both category - randomly pick who loses
      loserIndex = Math.random() < 0.5 ? 0 : 1;
    }
    
    // Winner is the opposite player
    const winnerIndex: 0 | 1 = loserIndex === 0 ? 1 : 0;
    setWinner(winnerIndex);
    setPhase('winner');
    
    setTimeout(() => {
      setPhase('reward');
    }, 1000);
  };

  const handleTakeReward = () => {
    // Auto-remove top item
    autoRemoveTopItem();
  };

  const handleDoubleOrNothing = () => {
    if (winner === null) return;
    setOriginalWinner(winner); // Store who won the round
    setGamblingPlayer(winner);
    setPhase('gamble');
    
    // Pick a double task based on winner's gender from their respective JSON
    const winnerGender = winner === 0 ? player1.gender : player2.gender;
    const tasks = winnerGender === 'male' 
      ? maleTasks.filter(t => t.type === 'double')
      : femaleTasks.filter(t => t.type === 'double');
    
    if (tasks.length > 0) {
      const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
      setCurrentTask(selectedTask);
      setTimer(selectedTask.timer || 30);
      setIsTimerRunning(true);
    }
  };

  const handleGambleSuccess = () => {
    setIsTimerRunning(false);
    setItemsToRemove(2);
    // Auto-remove 2 items
    setTimeout(() => autoRemoveTwoItems(), 500);
  };

  const autoRemoveTwoItems = () => {
    if (winner === null) return;
    
    const loser = winner === 0 ? 1 : 0;
    const loserItems = loser === 0 ? [...player1Items] : [...player2Items];
    
    // Remove first 2 non-permanent items and track names
    let removed = 0;
    const removedNames: string[] = [];
    for (let i = 0; i < loserItems.length && removed < 2; i++) {
      if (!loserItems[i].isPermanent) {
        removedNames.push(loserItems[i].name);
        loserItems.splice(i, 1);
        removed++;
        i--; // Adjust index after removal
      }
    }
    
    setRemovedItemName(removedNames.join(' & '));
    loser === 0 ? setPlayer1Items(loserItems) : setPlayer2Items(loserItems);
    
    // Show removal confirmation
    setPhase('removal');
  };

  const handleGambleFail = () => {
    setIsTimerRunning(false);
    // The original loser (who lost the round) now gets to remove from the challenger
    if (originalWinner === null) return;
    const originalLoser = originalWinner === 0 ? 1 : 0;
    setWinner(originalLoser); // Now the loser becomes winner and removes from challenger
    setItemsToRemove(1);
    setIsGambleFail(true);
    setRemovedItemName(''); // Clear any previous name
    
    // Show removal phase without actually removing - just announce the turn reversal
    setPhase('removal');
  };

  const autoRemoveTopItem = () => {
    if (winner === null) return;
    
    const loser = winner === 0 ? 1 : 0;
    const loserItems = loser === 0 ? [...player1Items] : [...player2Items];
    
    // Find first non-permanent item and remove it
    const removableIndex = loserItems.findIndex(item => !item.isPermanent);
    
    if (removableIndex !== -1) {
      const itemName = loserItems[removableIndex].name;
      setRemovedItemName(itemName);
      loserItems.splice(removableIndex, 1);
      loser === 0 ? setPlayer1Items(loserItems) : setPlayer2Items(loserItems);
      
      // Show removal confirmation with item name
      setPhase('removal');
    }
  };

  const handleContinueAfterRemoval = () => {
    // Only remove item if we're in gamble fail mode (item hasn't been removed yet)
    if (isGambleFail && winner !== null) {
      const loser = winner === 0 ? 1 : 0;
      const loserItems = loser === 0 ? [...player1Items] : [...player2Items];
      const removableIndex = loserItems.findIndex(item => !item.isPermanent);
      
      if (removableIndex !== -1) {
        loserItems.splice(removableIndex, 1);
        loser === 0 ? setPlayer1Items(loserItems) : setPlayer2Items(loserItems);
      }
    }
    
    // Check if game over
    const loser = winner === 0 ? 1 : 0;
    const loserItems = loser === 0 ? player1Items : player2Items;
    const remainingNonPermanent = loserItems.filter(item => !item.isPermanent);
    
    if (remainingNonPermanent.length === 0) {
      setPhase('gameover');
    } else {
      setPhase('task');
      startNewRound();
    }
  };

  const handlePlayAgain = () => {
    setPhase('setup');
    setPlayer1Items([]);
    setPlayer2Items([]);
    setRoundCount(0);
    setWinner(null);
    setItemsToRemove(1);
    setCurrentTask(null);
  };

  const handleBackButton = () => {
    if (phase === 'setup') {
      // In setup, go back to activity selection
      onComplete();
    } else {
      // In game, go back to strip setup
      handlePlayAgain();
    }
  };

  // === PHASE: SETUP ===
  if (phase === 'setup') {
    return (
      <div className="p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto mt-4 md:mt-8">
          {/* Header with Back button */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-4xl md:text-6xl font-thin tracking-tight uppercase text-white/90">Strip</h2>
            <button
              onClick={onComplete}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-light text-center mb-6 md:mb-8">Setup Your Items</p>

          {/* Player Items in compact grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Player 1 Items */}
            <PlayerItemsSetup
              playerName={player1.name}
              items={player1Items}
              onMoveUp={(idx) => handleMoveItemUp(0, idx)}
              onMoveDown={(idx) => handleMoveItemDown(0, idx)}
              onDelete={(idx) => handleDeleteItem(0, idx)}
              onAdd={(name) => handleAddItem(0, name)}
            />
            <PlayerItemsSetup
              playerName={player2.name}
              items={player2Items}
              onMoveUp={(idx) => handleMoveItemUp(1, idx)}
              onMoveDown={(idx) => handleMoveItemDown(1, idx)}
              onDelete={(idx) => handleDeleteItem(1, idx)}
              onAdd={(name) => handleAddItem(1, name)}
            />
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-6 md:py-8 bg-white text-black hover:bg-white/90 transition-all text-xl md:text-2xl font-thin uppercase tracking-tight mt-6 md:mt-8"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // === PHASE: TASK ===
  if (phase === 'task' && currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleBackButton}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <div className="text-center mb-4 md:mb-6">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <h2 className="text-3xl md:text-5xl font-thin tracking-tight uppercase text-white/90">Round {roundCount}</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/30 font-light">({taskCategory})</span>
            </div>
            <div className="text-6xl md:text-8xl font-thin text-white/60 mb-6 md:mb-8">{timer}s</div>
            <p className="text-base md:text-xl font-light text-white/90 leading-relaxed px-4">{currentTask.text}</p>
          </div>

          {/* Show buttons based on task category */}
          {taskCategory === 'both' ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={() => handlePlayerFinished(0)}
                disabled={!isTimerRunning}
                className={`py-8 md:py-12 text-lg md:text-2xl font-thin uppercase tracking-tight transition-all ${
                  player1.gender === 'male' 
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-300 hover:bg-blue-500/30' 
                    : 'bg-pink-500/20 border-2 border-pink-500 text-pink-300 hover:bg-pink-500/30'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {player1.name} Done
              </button>
              <button
                onClick={() => handlePlayerFinished(1)}
                disabled={!isTimerRunning}
                className={`py-8 md:py-12 text-lg md:text-2xl font-thin uppercase tracking-tight transition-all ${
                  player2.gender === 'male' 
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-300 hover:bg-blue-500/30' 
                    : 'bg-pink-500/20 border-2 border-pink-500 text-pink-300 hover:bg-pink-500/30'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {player2.name} Done
              </button>
            </div>
          ) : taskCategory === 'male' ? (
            <div className="mt-6 md:mt-8">
              <button
                onClick={() => handlePlayerFinished(player1.gender === 'male' ? 0 : 1)}
                disabled={!isTimerRunning}
                className="w-full py-8 md:py-12 text-lg md:text-2xl font-thin uppercase tracking-tight transition-all bg-blue-500/20 border-2 border-blue-500 text-blue-300 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {player1.gender === 'male' ? player1.name : player2.name} Done
              </button>
            </div>
          ) : (
            <div className="mt-8 md:mt-12">
              <button
                onClick={() => handlePlayerFinished(player1.gender === 'female' ? 0 : 1)}
                disabled={!isTimerRunning}
                className="w-full py-8 md:py-12 text-lg md:text-2xl font-thin uppercase tracking-tight transition-all bg-pink-500/20 border-2 border-pink-500 text-pink-300 hover:bg-pink-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {player1.gender === 'female' ? player1.name : player2.name} Done
              </button>
            </div>
          )}

          {/* Clothing Status */}
          <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 md:gap-6">
            <div className="border border-white/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-2">{player1.name}</p>
              <p className="text-2xl md:text-3xl font-thin text-white/90">{player1Items.filter(i => !i.isPermanent).length}</p>
              <p className="text-xs text-white/40 font-light">items left</p>
            </div>
            <div className="border border-white/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-2">{player2.name}</p>
              <p className="text-2xl md:text-3xl font-thin text-white/90">{player2Items.filter(i => !i.isPermanent).length}</p>
              <p className="text-xs text-white/40 font-light">items left</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === PHASE: WINNER ===
  if (phase === 'winner' && winner !== null) {
    const winnerPlayer = winner === 0 ? player1 : player2;
    const loserPlayer = winner === 0 ? player2 : player1;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleBackButton}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className={`text-4xl md:text-7xl font-thin tracking-tight uppercase mb-3 md:mb-4 ${
              winnerPlayer.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
            }`}>
              {winnerPlayer.name} Wins!
            </h2>
            <p className="text-base md:text-xl text-white/60 font-light">
              You may remove 1 item from {loserPlayer.name}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // === PHASE: REWARD ===
  if (phase === 'reward' && winner !== null) {
    const loserPlayer = winner === 0 ? player2 : player1;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleBackButton}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl md:text-6xl font-thin tracking-tight uppercase text-white/90 mb-2 md:mb-3">Your Reward</h2>
            <p className="text-sm md:text-lg text-white/60 font-light">
              Remove 1 item from {loserPlayer.name}
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleTakeReward}
              className="w-full py-4 md:py-6 bg-green-600 hover:bg-green-700 text-white transition-all text-lg md:text-xl font-thin uppercase tracking-tight"
            >
              Take It
            </button>
            
            <button
              onClick={handleDoubleOrNothing}
              className="w-full py-4 md:py-6 bg-red-600 hover:bg-red-700 text-white transition-all text-lg md:text-xl font-thin uppercase tracking-tight"
            >
              Double or Nothing
            </button>
          </div>

          <p className="text-center text-xs md:text-sm uppercase tracking-[0.2em] text-white/40 font-light mt-6 md:mt-8 px-4 leading-relaxed">
            Take It: Remove 1 item safely<br/>
            Double or Nothing: Complete a challenge to remove 2 items, or they remove 1 from you
          </p>
        </div>
      </div>
    );
  }

  // === PHASE: GAMBLE ===
  if (phase === 'gamble' && currentTask && gamblingPlayer !== null) {
    const gambler = gamblingPlayer === 0 ? player1 : player2;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleBackButton}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-5xl font-thin tracking-tight uppercase text-white/90 mb-3 md:mb-4">
              {gambler.name}'s Challenge
            </h2>
            <div className="text-5xl md:text-7xl font-thin text-red-400 mb-4 md:mb-6">{timer}s</div>
            <p className="text-base md:text-xl font-light text-white/90 leading-relaxed px-4">{currentTask.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={handleGambleSuccess}
              disabled={!isTimerRunning}
              className="py-4 md:py-6 bg-green-600 hover:bg-green-700 text-white text-base md:text-xl font-thin uppercase tracking-tight transition-all disabled:opacity-30"
            >
              I Did It
            </button>
            <button
              onClick={handleGambleFail}
              disabled={!isTimerRunning}
              className="py-4 md:py-6 bg-red-600 hover:bg-red-700 text-white text-base md:text-xl font-thin uppercase tracking-tight transition-all disabled:opacity-30"
            >
              I Failed
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === PHASE: REMOVAL (Display Only) ===
  if (phase === 'removal' && winner !== null) {
    const winnerPlayer = winner === 0 ? player1 : player2;
    const loserPlayer = winner === 0 ? player2 : player1;
    const loserItems = winner === 0 ? player2Items : player1Items;
    
    // For gamble fail, calculate item name on the fly
    const displayItemName = isGambleFail && !removedItemName 
      ? (loserItems.find(item => !item.isPermanent)?.name || 'Item')
      : removedItemName;
    
    // Calculate remaining items AFTER removal (for gamble fail)
    const remainingAfterRemoval = isGambleFail 
      ? loserItems.filter(i => !i.isPermanent).length - 1
      : loserItems.filter(i => !i.isPermanent).length;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={handleBackButton}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.2em] text-white/60 font-light"
            >
              Back
            </button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {!isGambleFail && removedItemName ? (
              <>
                <h2 className={`text-3xl md:text-6xl font-thin tracking-tight uppercase mb-3 md:mb-4 ${
                  winnerPlayer.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
                }`}>
                  {removedItemName}
                </h2>
                <p className="text-base md:text-2xl text-white/60 font-light mb-6 md:mb-8">
                  {loserPlayer.name} removed {itemsToRemove} item{itemsToRemove > 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <>
                <h2 className={`text-3xl md:text-6xl font-thin tracking-tight uppercase mb-3 md:mb-4 text-red-400`}>
                  Challenge Failed!
                </h2>
                <p className="text-base md:text-2xl text-white/60 font-light mb-2">
                  {winnerPlayer.name} gets to remove
                </p>
                <p className="text-2xl md:text-4xl font-thin text-white/90 mb-6 md:mb-8">
                  {displayItemName}
                </p>
              </>
            )}
            
            {/* Show remaining items */}
            <div className="border border-white/20 p-4 md:p-6 inline-block mb-6 md:mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-2">{loserPlayer.name} has</p>
              <p className="text-3xl md:text-4xl font-thin text-white/90">{remainingAfterRemoval}</p>
              <p className="text-xs text-white/40 font-light">items left</p>
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinueAfterRemoval}
              className="w-full py-4 md:py-6 bg-white text-black hover:bg-white/90 transition-all text-lg md:text-xl font-thin uppercase tracking-tight"
            >
              Continue
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // === PHASE: GAMEOVER ===
  if (phase === 'gameover' && winner !== null) {
    const winnerPlayer = winner === 0 ? player1 : player2;
    
    return (
      <div className="p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto mt-4 md:mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 md:py-20"
          >
            <h2 className={`text-5xl md:text-7xl font-thin tracking-tight uppercase mb-6 ${
              winnerPlayer.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
            }`}>
              {winnerPlayer.name} Wins!
            </h2>
            <div className="border border-white/20 p-6 md:p-8 mb-8 md:mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-light mb-2">Game Stats</p>
              <p className="text-2xl md:text-3xl font-thin text-white/90 mb-1">{roundCount} Rounds</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <button
                onClick={handlePlayAgain}
                className="w-full py-6 md:py-8 bg-white text-black hover:bg-white/90 transition-all text-xl md:text-2xl font-thin uppercase tracking-tight"
              >
                Play Again
              </button>
              <button
                onClick={onComplete}
                className="w-full py-4 md:py-6 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/60 transition-all text-lg md:text-xl font-thin uppercase tracking-tight"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper Component for Setup Phase
function PlayerItemsSetup({
  playerName,
  items,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAdd
}: {
  playerName: string;
  items: ClothingItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: (name: string) => void;
}) {
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName);
      setNewItemName('');
    }
  };

  return (
    <div className="border border-white/20 p-3 md:p-4">
      <h3 className="text-sm md:text-base font-thin uppercase tracking-tight text-white/90 mb-3">{playerName}</h3>
      
      <div className="space-y-1 mb-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1 md:gap-2 border border-white/10 p-1.5 md:p-2 text-xs md:text-sm">
            <span className="flex-1 font-light text-white/90">{item.name}</span>
            {item.isPermanent ? (
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/30 font-light">🔒</span>
            ) : (
              <>
                <button
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="px-1.5 py-0.5 text-[10px] border border-white/20 text-white/60 hover:border-white/40 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  onClick={() => onMoveDown(index)}
                  disabled={index === items.length - 1}
                  className="px-1.5 py-0.5 text-[10px] border border-white/20 text-white/60 hover:border-white/40 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="px-1.5 py-0.5 text-[10px] border border-red-500/30 text-red-400/60 hover:border-red-500/60"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-1 md:gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add item..."
          className="flex-1 px-2 py-1.5 bg-transparent border border-white/20 text-white/90 text-xs font-light placeholder:text-white/30 focus:border-white/40 outline-none"
        />
        <button
          onClick={handleAdd}
          className="px-2 md:px-3 py-1.5 border border-white/20 text-white/60 hover:border-white/40 text-[10px] uppercase tracking-wider font-light"
        >
          +
        </button>
      </div>
    </div>
  );
}
