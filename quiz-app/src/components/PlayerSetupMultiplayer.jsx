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
    if (!username) return alert("Enter your name");
    if (!roomId) return alert("Enter or generate room ID");
    navigate("/multiplayer", { state: { username, roomId, category, difficulty } });
  };

  return (
    <div>
      <h2>Multiplayer Setup</h2>
      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={generateRoomId}>Generate Room ID</button>
      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
};

export default PlayerSetupMultiplayer;
