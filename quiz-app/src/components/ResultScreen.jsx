// src/components/ResultScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, players, username, roomId } = location.state || {};

  return (
    <div style={{ padding: 20 }}>
      <h2>Game Over</h2>

      {roomId ? (
        <>
          <h3>Leaderboard (Room: {roomId})</h3>
          <ul>
            {players.map((p) => (
              <li
                key={p.username}
                style={{
                  fontWeight: p.username === username ? "bold" : "normal",
                }}
              >
                {p.username}: {p.score}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h3>Your Score: {score}</h3>
      )}

      <button onClick={() => navigate("/")}>Play Again</button>
    </div>
  );
};

export default ResultScreen;
