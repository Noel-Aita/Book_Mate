// src/components/SinglePlayerQuiz.jsx
import React, { useEffect, useState } from "react";
import localQuestions from "../data/localQuestions.js";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const SinglePlayerQuiz = ({ category, difficulty }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Example API endpoint; replace with real API if available
        const res = await fetch(
          `http://localhost:5000/api/questions?category=${encodeURIComponent(
            category
          )}&difficulty=${encodeURIComponent(difficulty)}`
        );
        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("API fetch failed, using fallback questions:", err);

        // Filter local questions by category/difficulty if available
        // For now, assuming localQuestions do not have these fields
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
    if (currentIndex >= questions.length - 1) {
        // Quiz finished, navigate to ResultScreen
        navigate("/result", {
        state: { mode: "single", score: selectedOption === currentQuestion.correct_answer ? currentIndex + 1 : currentIndex, total: questions.length },
        });
    } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption("");
    }
    };

    // Replace Next button onClick
    <button onClick={handleNext} disabled={!selectedOption}>
    {currentIndex >= questions.length - 1 ? "Finish Quiz" : "Next"}
    </button>



  return (
    <div style={{ padding: "20px" }}>
      <h2>{currentQuestion.question}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((opt, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setSelectedOption(opt)}
              disabled={!!selectedOption}
              style={{
                padding: "10px 15px",
                borderRadius: 5,
                border: "1px solid #ccc",
                backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
                cursor: !!selectedOption ? "not-allowed" : "pointer",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption("");
        }}
        disabled={!selectedOption || currentIndex >= questions.length - 1}
        style={{
          padding: "10px 20px",
          borderRadius: 5,
          border: "none",
          backgroundColor: "#2196F3",
          color: "#fff",
          cursor: !selectedOption || currentIndex >= questions.length - 1 ? "not-allowed" : "pointer",
        }}
      >
        {currentIndex >= questions.length - 1 ? "Finish Quiz" : "Next"}
      </button>
    </div>
  );
};

export default SinglePlayerQuiz;
