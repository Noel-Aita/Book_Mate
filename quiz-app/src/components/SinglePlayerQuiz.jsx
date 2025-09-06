// src/components/SinglePlayerQuiz.jsx
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions.js";

const SinglePlayerQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/questions");
        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("API fetch failed, using fallback:", err);
        setQuestions(localQuestions);
      }
    };
    fetchQuestions();
  }, []);

  if (!questions.length) return <Layout><p>Loading questions...</p></Layout>;

  const currentQuestion = questions[currentIndex];
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
    () => Math.random() - 0.5
  );

  return (
    <Layout>
      <div>
        <h2>{currentQuestion.question}</h2>
        <ul>
          {options.map((opt, idx) => (
            <li key={idx}>
              <button
                onClick={() => setSelectedOption(opt)}
                disabled={!!selectedOption}
                style={{ backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee" }}
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
          disabled={!selectedOption}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default SinglePlayerQuiz;
