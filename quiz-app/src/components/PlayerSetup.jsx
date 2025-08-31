// src/components/PlayerSetup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PlayerSetup.module.css";

/**
 * Allows player to choose single or multi-player mode.
 * Navigates to CategorySelection.
 */
const PlayerSetup = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2>Choose Player Mode</h2>
      <button
        onClick={() => navigate("/category")} // single-player
        className={styles.single_button}
      >
        Single Player
      </button>
      <button
        onClick={() => navigate("/category")} // multi-player
        className={styles.multi_button}
      >
        Multi Player
      </button>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        Back to Home
      </button>
    </div>
  );
};

export default PlayerSetup;
