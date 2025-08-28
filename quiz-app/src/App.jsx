// src/App.jsx
import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import sampleQuizData from "./data/sampleData"; // fallback data

function App() {
  // --------------------------
  // State
  // --------------------------
  const [stage, setStage] = useState("home"); // home | quiz | results
  const [questions, setQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);

  // --------------------------
  // Start Quiz (called from HomeScreen)
  // --------------------------
  const startQuiz = (config) => {
    // For now, just load sample questions
    // Later you can fetch based on category/difficulty
    setQuestions(sampleQuizData);
    setStage("quiz");
  };

  // --------------------------
  // Finish Quiz (called from QuizScreen)
  // --------------------------
  const finishQuiz = (score) => {
    setFinalScore(score);
    setStage("results");
  };

  // --------------------------
  // Restart Quiz (called from ResultsScreen)
  // --------------------------
  const restartQuiz = () => {
    setQuestions([]);
    setFinalScore(0);
    setStage("home");
  };

  // --------------------------
  // Render screens conditionally
  // --------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {stage === "home" && <HomeScreen onStart={startQuiz} />}
      {stage === "quiz" && (
        <QuizScreen questions={questions} onFinish={finishQuiz} />
      )}
      {stage === "results" && (
        <ResultsScreen score={finalScore} onRestart={restartQuiz} />
      )}
    </div>
  );
}

export default App;
