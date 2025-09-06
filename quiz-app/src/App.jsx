// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
import CategoryDifficultySelect from "./components/CategoryDifficultySelect";

const App = () => {
  const [user, setUser] = useState(null); // store authenticated user info
  const [quizSetup, setQuizSetup] = useState({ mode: null, category: null, difficulty: null });

  return (
    <Router>
      <Routes>
        {/* Splash → Home */}
        <Route path="/" element={<SplashScreen />} />

        {/* Home screen */}
        <Route path="/home" element={<HomeScreen />} />

        {/* Login / Signup */}
        <Route path="/login" element={<LoginScreen onAuth={setUser} />} />

        {/* Category and Difficulty selection for both modes */}
        <Route
          path="/select"
          element={
            <CategoryDifficultySelect
              setup={quizSetup}
              setSetup={setQuizSetup}
            />
          }
        />

        {/* Multiplayer Player Setup */}
        <Route
          path="/multiplayer-setup"
          element={
            <PlayerSetupMultiplayer
              onSetup={(data) => setQuizSetup({ ...quizSetup, ...data, mode: "multi" })}
            />
          }
        />

        {/* Quiz Screen (Single or Multiplayer) */}
        <Route
          path="/quiz"
          element={
            <QuizScreen
              mode={quizSetup.mode}
              setup={quizSetup}
              category={quizSetup.category}
              difficulty={quizSetup.difficulty}
            />
          }
        />

        {/* Result Screen */}
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
