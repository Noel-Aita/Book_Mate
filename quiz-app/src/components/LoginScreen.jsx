import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginScreen.module.css";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mock login/signup
    if (username.trim() && password.trim()) {
      localStorage.setItem("user", username);
      navigate("/select");
    } else {
      setError("Please enter username and password");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className={styles.toggleLink}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default LoginScreen;
