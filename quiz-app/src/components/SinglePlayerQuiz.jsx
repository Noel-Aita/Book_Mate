import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import localQuestions from "../data/localQuestions";

const SinglePlayerQuiz = ({ username }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const question = localQuestions[index];

  const handleAnswer = (answer) => {
    if (answer === question.correct) {
      setScore(score + 1);
    }

    if (index + 1 < localQuestions.length) {
      setIndex(index + 1);
    } else {
      navigate("/results", { state: { score, total: localQuestions.length, username } });
    }
  };

  return (
    <div>
      <h2>Quiz for {username}</h2>
      <p>{question.question}</p>
      {question.options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
};

export default SinglePlayerQuiz;
