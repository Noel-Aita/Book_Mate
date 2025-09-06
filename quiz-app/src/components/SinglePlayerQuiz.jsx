import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions.js";

const SinglePlayerQuiz = () => {
  const [questions, setQuestions] = useState(localQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

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
