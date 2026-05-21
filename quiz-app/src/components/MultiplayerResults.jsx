// src/components/MultiplayerResults.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MultiplayerResults.module.css";

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];

const MultiplayerResults = () => {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const { players = [], totalQuestions = 0 } = state || {};

  // Sort by score descending
  const ranked = [...players].sort((a, b) => b.score - a.score);
  const winner = ranked[0];

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.trophy}>🏆</div>
        <h2 className={styles.title}>Game Over!</h2>
        <p className={styles.winnerLine}>
          <span style={{ color: winner?.color }}>{winner?.avatar} {winner?.name}</span>
          {" "}wins with {winner?.score} / {totalQuestions}!
        </p>

        {/* Leaderboard */}
        <div className={styles.leaderboard}>
          {ranked.map((p, i) => {
            const pct = totalQuestions > 0 ? Math.round((p.score / totalQuestions) * 100) : 0;
            return (
              <div
                key={i}
                className={`${styles.row} ${i === 0 ? styles.rowFirst : ""}`}
                style={{ "--pcolor": p.color }}
              >
                <span className={styles.medal}>{MEDALS[i] || "🎮"}</span>
                <span className={styles.rowAvatar}>{p.avatar}</span>
                <span className={styles.rowName}>{p.name}</span>
                {p.type === "cpu" && <span className={styles.cpuTag}>CPU</span>}
                <div className={styles.barWrap}>
                  <div className={styles.bar} style={{ width: `${pct}%`, background: p.color }} />
                </div>
                <span className={styles.rowScore}>{p.score}/{totalQuestions}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button className={styles.playAgain} onClick={() => navigate("/multiplayer-setup")}>
            🔄 Play Again
          </button>
          <button className={styles.homeBtn} onClick={() => navigate("/")}>
            ← Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default MultiplayerResults;
