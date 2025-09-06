// src/components/SinglePlayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import localQuestions from "../data/localQuestions.js";

const SinglePlayerQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category || "General Knowledge";
  const difficulty = location.state?.difficulty || "easy";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions?category=${category}&difficulty=${difficulty}`);
        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("API fetch failed, using fallback questions:", err);
        setQuestions(localQuestions);
      }
    };

    fetchQuestions();
  }, [category, difficulty]);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQuestion = questions[currentIndex];
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
    () => Math.random() - 0.5
  );

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
    } else {
      // Quiz finished, navigate to result screen
      navigate("/result", { state: { score: calculateScore() } });
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (q.userAnswer === q.correct_answer) score += 1;
    });
    return score;
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Record user answer
    questions[currentIndex].userAnswer = option;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <h3>{currentQuestion.question}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((opt, idx) => (
          <li key={idx} style={{ margin: "10px 0" }}>
            <button
              onClick={() => handleOptionSelect(opt)}
              disabled={!!selectedOption}
              style={{
                padding: "10px 20px",
                width: "100%",
                backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
                border: "none",
                borderRadius: 5,
                cursor: selectedOption ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={!selectedOption}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: selectedOption ? "pointer" : "not-allowed",
        }}
      >
        {currentIndex + 1 < questions.length ? "Next" : "Finish"}
      </button>
    </div>
  );
};

export default SinglePlayerQuiz;
