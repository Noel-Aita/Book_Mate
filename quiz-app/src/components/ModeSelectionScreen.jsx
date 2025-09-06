// src/components/ModeSelectionScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "../styles/ModeSelectionScreen.module.css";

const ModeSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <Layout >
      <div className={styles.modeContainer}>
        <h2>Select Mode</h2>
        <button className={styles.SingleButton}
          onClick={() => navigate("/category", { state: { mode: "single" } })}
        >
          Single Player
        </button>
        <button className={styles.MultiButton}
          onClick={() =>
            navigate("/multiplayer-setup", { state: { mode: "multi" } })
          }
        >
          Multiplayer
        </button>
      </div>
    </Layout>
  );
};

export default ModeSelectionScreen;
