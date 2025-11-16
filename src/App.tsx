import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Setup from './pages/Setup';
import Game from './pages/Game';
import { useBackButtonHandler } from './hooks/useBackButton';
import { hasSavedGame } from './utils/storage';

function AppRoutes() {
  useBackButtonHandler();
  
  // Check if there's a saved game to determine initial route
  const hasGame = hasSavedGame();

  return (
    <Routes>
      <Route path="/" element={hasGame ? <Navigate to="/game" replace /> : <Setup />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<Navigate to={hasGame ? "/game" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="min-h-screen bg-black text-white">
          <AppRoutes />
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;
