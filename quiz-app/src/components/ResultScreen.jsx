// src/components/ResultScreen.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultScreen.module.css";

const ResultScreen = ({ playerName: nameProp }) => {
  const navigate  = useNavigate();
  const { state } = useLocation();

  const score          = state?.score          ?? 0;
  const totalQuestions = state?.totalQuestions ?? 0;
  const playerName     = state?.playerName     ?? nameProp ?? "Player";

  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getMessage = () => {
    if (pct === 100) return "Perfect score! You're unstoppable! 🔥";
    if (pct >= 80)   return "Great job! You really know your stuff.";
    if (pct >= 60)   return "Not bad! A bit more practice and you'll ace it.";
    if (pct >= 40)   return "Keep going — every quiz makes you sharper.";
    return "Tough round! Give it another shot.";
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.trophy}>
          {pct === 100 ? "🏆" : pct >= 60 ? "🎯" : "📚"}
        </div>

        <h2 className={styles.title}>Quiz Complete!</h2>

        {/* Player name */}
        <p className={styles.playerName}>Well done, {playerName}!</p>

        {/* Score ring */}
        <div className={styles.scoreRing} style={{ "--pct": `${pct}%` }}>
          <div className={styles.scoreText}>
            <span className={styles.scoreNumber}>{score}/{totalQuestions}</span>
            <span className={styles.scoreLabel}>{pct}%</span>
          </div>
        </div>

        <p className={styles.message}>{getMessage()}</p>

        <div className={styles.actions}>
          <button className={styles.retrybutton} onClick={() => navigate("/category")}>
            🔄 Play Again
          </button>
          <button className={styles.button} onClick={() => navigate("/")}>
            ← Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultScreen;
