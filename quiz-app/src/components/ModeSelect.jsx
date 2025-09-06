// src/components/ModeSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ModeSelect = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    return <p>Please login to select a mode.</p>;
  }

  const handleSelect = (mode) => {
    // Pass mode to next screen
    navigate("/category", { state: { mode } });
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Select Game Mode</h2>
      <div style={{ marginTop: 20 }}>
        <button
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
          onClick={() => handleSelect("single")}
        >
          Single Player
        </button>

        <button
          style={{
            padding: "10px 20px",
            marginLeft: 10,
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
          onClick={() => handleSelect("multi")}
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};

export default ModeSelect;
