import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../services/api"; // API calls from backend
import styles from "../styles/AuthScreen.module.css";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handles login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (isLogin) {
        response = await login(username, password);
      } else {
        response = await signup(username, password);
      }

      // Save token & username in localStorage for later use
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);

      // Navigate to player setup after authentication
      navigate("/player-setup");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.toggle}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthScreen;
