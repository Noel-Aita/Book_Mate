// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreen = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) return alert("Enter username and password");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      // Store user info in parent state
      setUser({ username: data.username, token: data.token });

      // Navigate to Mode Selection
      navigate("/select");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 8, marginBottom: 5, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8, width: "100%" }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          marginRight: 10,
          borderRadius: 5,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isSignup ? "Signup" : "Login"}
      </button>

      <button
        onClick={() => setIsSignup(!isSignup)}
        style={{
          padding: "10px 20px",
          borderRadius: 5,
          border: "none",
          backgroundColor: "#2196F3",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </button>
    </div>
  );
};

export default LoginScreen;
