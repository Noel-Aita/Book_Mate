import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import ModeSelectionScreen from "./components/ModeSelectionScreen";
import PlayerSetupSingle from "./components/PlayerSetupSingle";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/select" element={<ModeSelectionScreen />} />
        <Route path="/setup-single" element={<PlayerSetupSingle />} />
        <Route path="/setup-multi" element={<PlayerSetupMultiplayer />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/results" element={<ResultScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
