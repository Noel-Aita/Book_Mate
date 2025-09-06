import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ModeSelectionScreen.module.css";

const ModeSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2>Select Game Mode</h2>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => navigate("/setup-single", { state: { mode: "single" } })}
          className={styles.modeButton}
        >
          Single Player
        </button>
        <button
          onClick={() => navigate("/setup-multi", { state: { mode: "multi" } })}
          className={styles.modeButton}
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;
