import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Screens
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import PlayerSetup from "./components/PlayerSetup";
import CategorySelection from "./components/CategorySelection";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";

/**
 * App.jsx
 * Main router and state management
 */
const App = () => {
  // Auth & player
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player, setPlayer] = useState(null);

  // Quiz state
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        <Route
          path="/login"
          element={
            <LoginScreen
              onLogin={(playerData) => {
                setPlayer(playerData);
                setIsLoggedIn(true);
              }}
            />
          }
        />

        <Route
          path="/setup"
          element={isLoggedIn ? <PlayerSetup /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/category"
          element={
            isLoggedIn ? (
              <CategorySelection
                onStartQuiz={(cat, diff) => {
                  setCategory(cat);
                  setDifficulty(diff);
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/quiz"
          element={
            isLoggedIn ? (
              <QuizScreen
                category={category}
                difficulty={difficulty}
                onFinish={(finalScore, total) => {
                  setScore(finalScore);
                  setTotalQuestions(total);
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/result"
          element={
            isLoggedIn ? (
              <ResultScreen score={score} totalQuestions={totalQuestions} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
