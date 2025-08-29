// src/App.jsx
import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";

function App() {
  const [stage, setStage] = useState("home"); 
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  // --------------------------
  // Start Quiz (fetch questions)
  // --------------------------
  const startQuiz = async (config) => {
  try {
    // Start with minimum params
    let url = `https://opentdb.com/api.php?amount=${config.numQuestions}&type=multiple`;

    // Only add category if user selected one
    if (config.category && config.category !== "any") {
      url += `&category=${config.category}`;
    }

    // Only add difficulty if user selected one
    if (config.difficulty && config.difficulty !== "any") {
      url += `&difficulty=${config.difficulty}`;
    }

    console.log("Fetching from:", url); // 👀 Check URL in console

    const res = await fetch(url);
    const data = await res.json();
    console.log("API Response:", data);

    if (data.response_code === 0 && data.results.length > 0) {
      setQuestions(data.results);
      setScore(0);
      setStage("quiz");
    } else {
      alert("⚠️ No questions found. Try reducing number or choosing 'Any'.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert("Failed to load quiz. Please try again.");
  }
};



  const finishQuiz = (finalScore) => {
    setScore(finalScore);
    setStage("result");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {stage === "home" && <HomeScreen onStart={startQuiz} />}
      {stage === "quiz" && (
        <QuizScreen questions={questions} onFinish={finishQuiz} />
      )}
      {stage === "result" && (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Finished! 🎉</h2>
          <p className="text-lg mb-4">
            Your Score: {score} / {questions.length}
          </p>
          <button
            onClick={() => setStage("home")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
