// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import ModeSelectionScreen from "./components/ModeSelectionScreen";
import CategoryDifficultyScreen from "./components/CategoryDifficultyScreen";
import SinglePlayerQuiz from "./components/SinglePlayerQuiz";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
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
        <Route path="/singleplayer" element={<SinglePlayerQuiz />} />
        <Route path="/multiplayer-setup" element={<PlayerSetupMultiplayer />} />
        <Route path="/multiplayer" element={<MultiplayerQuiz />} />
        <Route path="/results" element={<ResultScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
