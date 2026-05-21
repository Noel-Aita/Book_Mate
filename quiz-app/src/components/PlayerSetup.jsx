// src/components/PlayerSetup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PlayerSetup.module.css";

const PlayerSetup = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Choose Your Mode</h2>
        <p className={styles.subtitle}>How do you want to play today?</p>

        <div className={styles.modeGrid}>
          {/* Single Player */}
          <div className={styles.modeCard} onClick={() => navigate("/category?mode=single")}>
            <div className={styles.modeIcon}>🎯</div>
            <h3 className={styles.modeName}>Single Player</h3>
            <p className={styles.modeDesc}>Play solo against the question bank. Beat your own score.</p>
            <span className={styles.modeBtn}>Play Solo</span>
          </div>

          {/* Multiplayer */}
          <div className={`${styles.modeCard} ${styles.modeCardMulti}`} onClick={() => navigate("/multiplayer-setup")}>
            <div className={styles.modeIcon}>⚔️</div>
            <h3 className={styles.modeName}>Multiplayer</h3>
            <p className={styles.modeDesc}>Up to 4 players. Take turns, compete locally or vs CPU.</p>
            <span className={`${styles.modeBtn} ${styles.modeBtnMulti}`}>Play Together</span>
          </div>
        </div>

        <button onClick={() => navigate("/")} className={styles.backButton}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
