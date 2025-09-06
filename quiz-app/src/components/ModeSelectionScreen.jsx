// src/components/ModeSelectionScreen.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Layout from "./Layout";
import styles from "../styles/ModeSelectionScreen.module.css";

const ModeSelectionScreen = () => {
  const { user } = useContext(AuthContext); // get logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user || !user.username) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSinglePlayer = () => {
    navigate("/category-difficulty", { state: { username: user.username, mode: "single" } });
  };

  const handleMultiPlayer = () => {
    navigate("/player-setup", { state: { username: user.username, mode: "multi" } });
  };

  return (
    <Layout>
      <div className={styles.modeContainer}>
        <h2>Select Game Mode</h2>
        <div className={styles.buttonGroup}>
          <button className={styles.modeButton} onClick={handleSinglePlayer}>
            Single Player
          </button>
          <button className={styles.modeButton} onClick={handleMultiPlayer}>
            Multiplayer
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ModeSelectionScreen;
