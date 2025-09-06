// src/components/AuthScreen.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/AuthScreen.module.css";

const AuthScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isSignup = location.state?.isSignup || false;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      login({ username: data.username });
      navigate("/mode");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2>{isSignup ? "Signup" : "Login"}</h2>
          <form onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.authInput}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authInput}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.authButton}>
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AuthScreen;
