// src/components/MultiPlayerQuiz.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import BlogSection from "./BlogSection";
import styles from "../styles/MultiPlayerQuiz.module.css";
import { getSocket } from "../services/socket";
import { localQuestions } from "../data/localQuestions";

const MultiPlayerQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, room, category, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!username || !room) {
      navigate("/login"); // enforce authentication
      return;
    }

    const filteredQuestions = localQuestions.filter(
      (q) => q.category === category && q.difficulty === difficulty
    );

    setQuestions(filteredQuestions);

    const socket = getSocket();

    socket.on("nextQuestion", (index) => {
      setCurrentIndex(index);
    });

    socket.on("endQuiz", (finalScores) => {
      navigate("/results", {
        state: { username, score, total: questions.length, multiplayer: true, finalScores },
      });
    });

    return () => {
      socket.off("nextQuestion");
      socket.off("endQuiz");
    };
  }, [username, room, category, difficulty, navigate]);

  const handleAnswer = (answer) => {
    const socket = getSocket();
    const correct = questions[currentIndex].correct_answer === answer;
    if (correct) setScore(score + 1);

    socket.emit("submitAnswer", { username, room, answer, correct });

    // Move to next question locally for single view; server can sync for multiplayer
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      socket.emit("finishQuiz", { username, room, score });
    }
  };

  if (!questions.length) return <p>Loading questions...</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <Layout>
      <div
        className={styles.quizContainer}
        style={{ backgroundImage: "url('/assets/multiplayer-bg.jpg')" }}
      >
        <h2>Room: {room}</h2>
        <h3>
          Question {currentIndex + 1}/{questions.length}
        </h3>
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

export default MultiPlayerQuiz;
