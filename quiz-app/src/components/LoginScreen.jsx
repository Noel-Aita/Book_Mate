// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginScreen.module.css";

/**
 * Displays login/signup form.
 * On successful login, navigates to Player Setup.
 */
const LoginScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return alert("Please enter a username");
    const playerData = { name: username };
    onLogin(playerData); // update player in App.jsx
    navigate("/setup"); // go to player setup
  };

  return (
    <div className={styles.container}>
      <h2 className = {styles.login_title}>Login / Signup</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        Back to Home
      </button>
    </div>
  );
};

export default LoginScreen;
