import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ModeSelectionScreen.module.css";

const ModeSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.modeContainer}>
      <h2>Select Game Mode</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => navigate("/single-setup")}>Single Player</button>
        <button onClick={() => navigate("/multi-setup")}>Multiplayer</button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;
