// src/components/HomeScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomeScreen.module.css";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to BookMate Quiz App</h1>
      <p>Select Login or Signup to continue:</p>
      <div className={styles.buttonGroup}>
        <button
          className={styles.homeButton}
          onClick={() => navigate("/login")}
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
