// src/components/AuthScreen.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, signup } from "../services/api"; // API calls
import BlogSection from "./BlogSection";

const AuthScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode"); // "login" or "signup"

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (mode === "login") {
        response = await login({ username, password });
      } else {
        response = await signup({ username, password });
      }

      // Save token locally if needed (optional)
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);

      // Navigate to ModeSelect
      navigate("/mode");
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1>{mode === "login" ? "Login" : "Signup"}</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>
        </form>
      </div>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default AuthScreen;
