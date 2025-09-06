// src/components/PlayerSetupMultiplayer.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PlayerSetupMultiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, difficulty } = location.state || {};

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  // Generate a new room ID
  const generateRoomId = () => {
    const id = Math.floor(100000 + Math.random() * 900000);
    setRoomId(id.toString());
  };

  // Join or create room
  const handleJoin = () => {
    if (!username || !roomId) {
      alert("Please enter a username and room ID");
      return;
    }

    navigate("/multiplayer", {
      state: { username, roomId, category, difficulty },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Multiplayer Setup</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={{ marginLeft: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Room ID:</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter existing room ID"
          style={{ marginLeft: "10px" }}
        />
        <button onClick={generateRoomId} style={{ marginLeft: "10px" }}>
          Create New Room
        </button>
      </div>

      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default PlayerSetupMultiplayer;
