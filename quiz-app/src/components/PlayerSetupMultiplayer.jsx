// src/components/PlayerSetupMultiplayer.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PlayerSetupMultiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, difficulty } = location.state || {};

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const generateRoomId = () => {
    const id = Math.floor(100000 + Math.random() * 900000);
    setRoomId(id.toString());
  };

  const handleJoin = () => {
    if (!username || !roomId) return alert("Enter username and room ID");
    navigate("/multiplayer", { state: { username, roomId, category, difficulty } });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Join Multiplayer Room</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={generateRoomId}>Generate Room ID</button>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default PlayerSetupMultiplayer;
