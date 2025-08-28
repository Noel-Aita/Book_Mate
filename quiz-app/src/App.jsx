import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import { decodeHtmlEntities, shuffleArray } from "./utils/helpers";

function App() {
  // Track which screen to show
  const [screen, setScreen] = useState("home");
  // Store fetched quiz data
  const [quizData, setQuizData] = useState([]);
  // Track user’s score
  const [score, setScore] = useState(0);

  // ------------------------------
  // Fetch Quiz Data from API
  // ------------------------------
  const fetchQuizData = async (amount, category, difficulty) => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
      );
      const data = await response.json();

      // Prepare questions for display
      const formattedData = data.results.map((q) => {
        const allAnswers = shuffleArray([
          ...q.incorrect_answers,
          q.correct_answer,
        ]);
        return {
          question: decodeHtmlEntities(q.question),
          correct_answer: decodeHtmlEntities(q.correct_answer),
          answers: allAnswers.map((ans) => decodeHtmlEntities(ans)),
        };
      });

      // Save questions and switch screen
      setQuizData(formattedData);
      setScore(0);
      setScreen("quiz"); // ✅ move to quiz screen
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  // ------------------------------
  // Handle quiz start
  // ------------------------------
  const startQuiz = ({ category, difficulty, amount }) => {
    fetchQuizData(amount, category, difficulty);
  };

  // ------------------------------
  // Handle quiz finish
  // ------------------------------
  const finishQuiz = (finalScore) => {
    setScore(finalScore);
    setScreen("results");
  };

  // ------------------------------
  // Render based on screen state
  // ------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {screen === "home" && <HomeScreen onStart={startQuiz} />}
      {screen === "quiz" && (
        <QuizScreen quizData={quizData} onFinish={finishQuiz} />
      )}
      {screen === "results" && (
        <ResultsScreen score={score} total={quizData.length} onRestart={() => setScreen("home")} />
      )}
    </div>
  );
}

export default App;
