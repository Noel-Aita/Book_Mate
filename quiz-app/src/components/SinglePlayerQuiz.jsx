// src/components/SinglePlayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import localQuestions from "../data/localQuestions.js";

const SinglePlayerQuiz = ({ category, difficulty }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Example API fetch — can filter by category/difficulty if API supports
        const res = await fetch(`http://localhost:5000/api/questions?category=${category}&difficulty=${difficulty}`);
        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("API fetch failed, using fallback questions:", err);
        // Filter localQuestions by category/difficulty if you implement tags
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
    if (selectedOption === currentQuestion.correct_answer) setScore(score + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
    } else {
      // Quiz finished → navigate to ResultScreen
      navigate("/result", { state: { score, total: questions.length } });
    }
  };

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            <button
              disabled={!!selectedOption}
              onClick={() => setSelectedOption(opt)}
              style={{
                backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleNext} disabled={!selectedOption}>
        Next
      </button>
    </div>
  );
};

export default SinglePlayerQuiz;
