// src/components/SignupScreen.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { AuthContext } from "./AuthContext";
import styles from "../styles/LoginScreen.module.css";

const SignupScreen = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter username");
    login(username); // treat signup same as login for now
    navigate("/mode");
  };

  return (
    <Layout>
      <div className={styles.loginContainer} style={{ backgroundImage: "url(/assets/signup-bg.jpg)" }}>
        <div className={styles.loginCard}>
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.loginInput}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
            />
            <button type="submit" className={styles.loginButton}>Sign Up</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignupScreen;
