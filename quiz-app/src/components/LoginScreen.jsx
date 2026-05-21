// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginScreen.module.css";

const LoginScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter a username");
    onLogin({ name: username.trim() });
    navigate("/setup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.orb} />
      <div className={styles.orbBottom} />

      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.logo}>✦ BookMate</p>
          <h2 className={styles.login_title}>Welcome back</h2>
          <p className={styles.subtitle}>Enter your name to jump into the quiz</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Display Name</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. Alex"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              autoComplete="off"
              autoFocus
            />
          </div>
          <button type="submit" className={styles.button}>
            Continue →
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <button onClick={() => navigate("/")} className={styles.backButton}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
