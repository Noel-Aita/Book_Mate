// src/components/SinglePlayerQuiz.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import BlogSection from "./BlogSection";
import styles from "../styles/SinglePlayerQuiz.module.css";
import { localQuestions } from "../data/localQuestions";

const SinglePlayerQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, category, difficulty } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!username) {
      navigate("/login"); // enforce authentication
    }
  }, [username, navigate]);

  const questions = localQuestions.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );

  const handleAnswer = (answer) => {
    const correct = questions[currentIndex].correct_answer === answer;
    if (correct) setScore(score + 1);
    setAnswers([...answers, { question: questions[currentIndex].question, answer, correct }]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/results", { state: { username, score, total: questions.length } });
    }
  };

  if (questions.length === 0) return <p>No questions found for selected category/difficulty.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <Layout>
      <div
        className={styles.quizContainer}
        style={{ backgroundImage: "url('/assets/singleplayer-bg.jpg')" }}
      >
        <h2>Question {currentIndex + 1}/{questions.length}</h2>
        <p>{currentQuestion.question}</p>
        <div className={styles.answers}>
          {currentQuestion.incorrect_answers
            .concat(currentQuestion.correct_answer)
            .sort()
            .map((answer, idx) => (
              <button key={idx} onClick={() => handleAnswer(answer)}>
                {answer}
              </button>
            ))}
        </div>
      </div>
      <BlogSection />
    </Layout>
  );
};

export default SinglePlayerQuiz;
