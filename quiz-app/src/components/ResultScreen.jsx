// src/components/ResultScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ResultScreen.module.css";

/**
 * Displays the final quiz results and provides navigation options.
 *
 * Props:
 * - score: number of correct answers
 * - totalQuestions: total number of questions
 */
const ResultScreen = ({ score, totalQuestions }) => {
  const navigate = useNavigate(); // hook to navigate between routes

  return (
    <div className={styles.container}>
      <form className={styles.result}>
      <h2 className={styles.firstresult}>Your Score: {score} / {totalQuestions}</h2>

      {/* Retry button goes back to quiz screen */}
      <button
        className={styles.retrybutton}
        onClick={() => navigate("/quiz")}
      >
        Retry Quiz
      </button>

      {/* Go home button */}
      <button
        className={styles.button}
        onClick={() => navigate("/")}
      >
        Home
      </button>
      </form>
    </div>
  );
};

export default ResultScreen;
