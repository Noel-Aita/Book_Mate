// src/components/PlayerSetupMultiplayer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket } from "../services/socket";

const PlayerSetupMultiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const difficulty = queryParams.get("difficulty");

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);

  // Connect to socket when roomId is set
  useEffect(() => {
    if (!socket && roomId && username) {
      const newSocket = connectSocket(username);
      setSocket(newSocket);

      newSocket.emit("joinRoom", roomId);

      newSocket.on("playersUpdate", (updatedPlayers) => {
        setPlayers(updatedPlayers);
      });

      return () => newSocket.disconnect();
    }
  }, [roomId, username, socket]);

  // Generate a random 6-digit room ID for host
  const generateRoomId = () => {
    const id = Math.floor(100000 + Math.random() * 900000);
    setRoomId(id.toString());
  };

  const handleJoin = () => {
    if (!username || !roomId) return alert("Enter username and room ID");
    // Save player info to navigate to QuizScreen
    navigate(`/quiz?mode=multi&roomId=${roomId}&category=${category}&difficulty=${difficulty}&username=${username}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
      <h2>Multiplayer Setup</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 10, marginBottom: 10, fontSize: 16 }}
      />
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: 10, marginBottom: 10, fontSize: 16 }}
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={generateRoomId} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Generate Room ID
        </button>
        <button onClick={handleJoin} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Join Room
        </button>
      </div>

      {/* Display current players in the room */}
      {players.length > 0 && (
        <div>
          <h3>Players in Room:</h3>
          <ul>
            {players.map((p, idx) => (
              <li key={idx}>
                {p.username} - Score: {p.score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerSetupMultiplayer;
