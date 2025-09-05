// src/components/PlayerSetupMultiplayer.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../services/socket";

const PlayerSetupMultiplayer = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username || !roomId) return alert("Enter username and room ID");
    const socket = connectSocket(username); // connect with username
    socket.emit("joinRoom", roomId); // join room
    navigate("/quiz", { state: { roomId, username } });
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
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

// 👇 This is the critical part
export default PlayerSetupMultiplayer;
