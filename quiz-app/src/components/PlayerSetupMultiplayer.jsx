import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PlayerSetupMultiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const generateRoomId = () => {
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomId(id);
  };

  const handleJoin = () => {
    if (username.trim() && roomId.trim()) {
      navigate("/quiz", { state: { mode, username, roomId } });
    }
  };

  return (
    <div>
      <h2>Multiplayer Setup</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={generateRoomId}>Generate Room ID</button>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default PlayerSetupMultiplayer;
