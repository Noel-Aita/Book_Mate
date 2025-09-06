// src/components/PlayerSetupMultiplayer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket } from "../services/socket";

const PlayerSetupMultiplayer = ({ user }) => {
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || "General Knowledge";
  const difficulty = location.state?.difficulty || "easy";

  const socket = connectSocket(user?.username);

  // Generate a random room ID
  const generateRoomId = () => {
    const id = Math.floor(100000 + Math.random() * 900000);
    setRoomId(id.toString());
  };

  const handleJoin = () => {
    if (!roomId) return alert("Enter or generate a Room ID");

    socket.emit("joinRoom", roomId, { category, difficulty });

    socket.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("quizStarted", () => {
      navigate("/quiz-multi", { state: { roomId, socket, players } });
    });
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Multiplayer Setup</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button onClick={generateRoomId} style={{ marginRight: 10 }}>
        Generate Room ID
      </button>
      <button onClick={handleJoin}>Join Room</button>

      <div style={{ marginTop: 20 }}>
        <h3>Players in Room:</h3>
        <ul>
          {players.map((p, idx) => (
            <li key={idx}>{p.username} - Score: {p.score}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerSetupMultiplayer;
