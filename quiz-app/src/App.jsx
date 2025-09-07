import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import CategoryDifficultyScreen from './components/CategoryDifficultyScreen';
import PlayerSetupMultiplayer from './components/PlayerSetupMultiplayer';
import SinglePlayerQuiz from './components/SinglePlayerQuiz';
import MultiplayerQuiz from './components/MultiplayerQuiz';
import ResultScreen from './components/ResultScreen';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          
          <Route path="/mode" element={
            <PrivateRoute>
              <ModeSelectionScreen />
            </PrivateRoute>
          } />
          
          <Route path="/category-difficulty" element={
            <PrivateRoute>
              <CategoryDifficultyScreen />
            </PrivateRoute>
          } />
          
          <Route path="/multiplayer-setup" element={
            <PrivateRoute>
              <PlayerSetupMultiplayer />
            </PrivateRoute>
          } />
          
          <Route path="/single-player" element={
            <PrivateRoute>
              <SinglePlayerQuiz />
            </PrivateRoute>
          } />
          
          <Route path="/multi-quiz" element={
            <PrivateRoute>
              <MultiplayerQuiz />
            </PrivateRoute>
          } />
          
          <Route path="/results" element={
            <PrivateRoute>
              <ResultScreen />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;