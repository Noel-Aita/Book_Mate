// src/components/ResultScreen.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BlogSection from "./BlogSection";

const ResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const { mode, score, total, players } = state; // multiplayer: players array, single: score & total

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "20px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>Quiz Results</h2>

        {mode === "single" && (
          <div style={{ marginTop: 20 }}>
            <p>
              You scored <strong>{score}</strong> out of <strong>{total}</strong>
            </p>
          </div>
        )}

        {mode === "multi" && players && (
          <div style={{ marginTop: 20 }}>
            <h3>Players Scores:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {players
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "10px" }}>
                    {p.username} - {p.score} {p.username === "You" ? "(You)" : ""}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleHome}
          style={{
            marginTop: 30,
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>

      {/* BlogSection visible on all pages except ResultScreen */}
      {/* Not displayed here as per design */}
    </div>
  );
};

export default ResultScreen;
