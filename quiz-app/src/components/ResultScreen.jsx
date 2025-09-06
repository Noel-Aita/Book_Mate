// src/components/ResultScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, players, multiplayer } = location.state || {};

  // Determine if single or multiplayer
  const isMultiplayer = multiplayer && Array.isArray(players);

  const handleRestart = () => {
    navigate("/select"); // Back to mode selection
  };

  const handleHome = () => {
    navigate("/home"); // Back to home screen
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Quiz Results</h2>

      {isMultiplayer ? (
        <div>
          <h3>Multiplayer Scores:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {players
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <li key={idx} style={{ margin: "10px 0" }}>
                  {idx + 1}. {p.username}: {p.score}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Your Score: {score}</h3>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleRestart}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
        <button
          onClick={handleHome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
