// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import ModeSelectionScreen from "./components/ModeSelectionScreen";
import CategoryDifficultySelect from "./components/CategoryDifficultyScreen";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
import SinglePlayerQuiz from "./components/SinglePlayerQuiz";
import MultiPlayerQuiz from "./components/MultiplayerQuiz";
import ResultsScreen from "./components/ResultScreen";
import { AuthContext } from "./components/AuthContext";

// PrivateRoute wrapper to enforce authentication
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />

        {/* Protected routes */}
        <Route
          path="/mode"
          element={
            <PrivateRoute>
              <ModeSelectionScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <CategoryDifficultySelect />
            </PrivateRoute>
          }
        />
        <Route
          path="/player-setup"
          element={
            <PrivateRoute>
              <PlayerSetupMultiplayer />
            </PrivateRoute>
          }
        />
        <Route
          path="/single-quiz"
          element={
            <PrivateRoute>
              <SinglePlayerQuiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/multi-quiz"
          element={
            <PrivateRoute>
              <MultiPlayerQuiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsScreen />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
