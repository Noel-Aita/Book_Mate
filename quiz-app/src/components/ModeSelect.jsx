// src/components/ModeSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ModeSelect = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    // Prevent navigation if not logged in
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.username}!</h2>
      <p>Select Quiz Mode:</p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/select-category", { state: { mode: "single" } })}
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
          Single Player
        </button>

        <button
          onClick={() => navigate("/player-setup-multiplayer")}
          style={{
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#2196F3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};

export default ModeSelect;
