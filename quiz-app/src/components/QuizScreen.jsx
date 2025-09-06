import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions";

const QuizScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  const [questions] = useState(localQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (correct) => {
    if (correct) setScore(score + 1);
    if (currentIndex + 1 < questions.length) setCurrentIndex(currentIndex + 1);
    else navigate("/results", { state: { score, username } });
  };

  const current = questions[currentIndex];

  return (
    <Layout>
      <div>
        <h2>{username}'s Quiz</h2>
        <p>{current.question}</p>
        {current.incorrect_answers.concat(current.correct_answer).sort().map((ans, idx) => (
          <button key={idx} onClick={() => handleAnswer(ans === current.correct_answer)}>
            {ans}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default QuizScreen;
