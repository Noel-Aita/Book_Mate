import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Screens
import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import ModeSelectionScreen from "./components/ModeSelectionScreen";
import CategoryDifficultyScreen from "./components/CategoryDifficultyScreen";
import PlayerSetupSingle from "./components/PlayerSetupSingle";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
import QuizScreen from "./components/QuizScreen";
import MultiplayerQuiz from "./components/MultiplayerQuiz";
import ResultScreen from "./components/ResultScreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/select" element={<ModeSelectionScreen />} />
        <Route path="/category" element={<CategoryDifficultyScreen />} />
        <Route path="/single-setup" element={<PlayerSetupSingle />} />
        <Route path="/multi-setup" element={<PlayerSetupMultiplayer />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/multiplayer" element={<MultiplayerQuiz />} />
        <Route path="/results" element={<ResultScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
