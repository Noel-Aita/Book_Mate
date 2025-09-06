// src/components/PlayerMode.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerMode = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Game Mode</h2>
      <button onClick={() => navigate("/setup")}>Single Player</button>
      <button onClick={() => navigate("/multiplayer-setup")}>Multiplayer</button>
    </div>
  );
};

export default PlayerMode;
