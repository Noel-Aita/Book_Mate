import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions";

const QuizScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, category, difficulty, mode } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`);
        const data = await res.json();
        if (data.results) setQuestions(data.results);
        else setQuestions(localQuestions); // fallback
      } catch {
        setQuestions(localQuestions); // fallback
      }
    };
    fetchQuestions();
  }, [category, difficulty]);

  const handleAnswer = (correct) => {
    if (correct) setScore(score + 1);
    if (currentIndex + 1 < questions.length) setCurrentIndex(currentIndex + 1);
    else navigate("/results", { state: { score, username } });
  };

  if (!questions.length) return <p>Loading questions...</p>;

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
