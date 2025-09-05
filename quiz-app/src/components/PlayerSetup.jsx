// src/components/PlayerSetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerSetupMultiplayer from "./PlayerSetupMultiplayer";

const PlayerSetup = ({ onSetup }) => {
  const [mode, setMode] = useState(null); // "single" or "multi"
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  if (!mode) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Select Mode</h2>
        <button onClick={() => setMode("single")}>Single Player</button>
        <button onClick={() => setMode("multi")}>Multiplayer</button>
      </div>
    );
  }

  if (mode === "single") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter Username</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            if (!username) return alert("Enter username");
            onSetup({ username });
            navigate("/category"); // single-player goes to category selection
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // Multiplayer setup
  return <PlayerSetupMultiplayer onSetup={onSetup} />;
};

export default PlayerSetup;
