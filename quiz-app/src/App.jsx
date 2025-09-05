// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Screens
import HomeScreen from "./components/HomeScreen";
import PlayerSetup from "./components/PlayerSetup";
import CategorySelection from "./components/CategorySelection";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";

const App = () => {
  // ------------------------
  // Player & quiz state
  // ------------------------
  const [player, setPlayer] = useState(null);      // { username, roomId? }
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        {/* Player setup route */}
        <Route
          path="/setup"
          element={<PlayerSetup onSetup={setPlayer} />}
        />

        {/* Category selection for single-player */}
        <Route
          path="/category"
          element={
            player?.roomId ? (
              <Navigate to="/quiz" replace /> // Multiplayer skips category
            ) : (
              <CategorySelection
                onStartQuiz={(cat, diff) => {
                  setCategory(cat);
                  setDifficulty(diff);
                }}
              />
            )
          }
        />

        {/* Quiz screen */}
        <Route
          path="/quiz"
          element={
            player ? (
              <QuizScreen
                category={category}
                difficulty={difficulty}
                roomId={player.roomId}   // undefined in single-player
                username={player.username}
                onFinish={(finalScore, total) => {
                  setScore(finalScore);
                  setTotalQuestions(total);
                }}
              />
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />

        {/* Result screen */}
        <Route
          path="/result"
          element={
            <ResultScreen score={score} totalQuestions={totalQuestions} />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
