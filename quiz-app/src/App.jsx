// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomeScreen          from "./components/HomeScreen";
import LoginScreen         from "./components/LoginScreen";
import PlayerSetup         from "./components/PlayerSetup";
import CategorySelection   from "./components/CategorySelection";
import QuizScreen          from "./components/QuizScreen";
import ResultScreen        from "./components/ResultScreen";
import MultiplayerSetup    from "./components/MultiplayerSetup";
import MultiplayerQuizScreen from "./components/MultiplayerQuizScreen";
import MultiplayerResults  from "./components/MultiplayerResults";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player,     setPlayer]     = useState(null);
  const [category,   setCategory]   = useState("");
  const [difficulty, setDifficulty] = useState("");

  const guard = (element) => isLoggedIn ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<HomeScreen />} />
        <Route path="/login" element={
          <LoginScreen onLogin={(p) => { setPlayer(p); setIsLoggedIn(true); }} />
        } />

        {/* Single-player flow */}
        <Route path="/setup"    element={guard(<PlayerSetup />)} />
        <Route path="/category" element={guard(
          <CategorySelection onStartQuiz={(cat, diff) => { setCategory(cat); setDifficulty(diff); }} />
        )} />
        <Route path="/quiz"     element={guard(
          <QuizScreen category={category} difficulty={difficulty} playerName={player?.name} />
        )} />
        <Route path="/results"  element={guard(<ResultScreen playerName={player?.name} />)} />

        {/* Multiplayer flow */}
        <Route path="/multiplayer-setup" element={guard(<MultiplayerSetup />)} />
        <Route path="/multi-quiz"        element={guard(<MultiplayerQuizScreen />)} />
        <Route path="/multi-results"     element={guard(<MultiplayerResults />)} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
