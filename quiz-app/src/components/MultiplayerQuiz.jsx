// src/components/MultiplayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";

const MultiplayerQuiz = () => {
  const location = useLocation();
  const { username, roomId } = location.state || {};
  const [players, setPlayers] = useState([username]);
  const [currentPlayer, setCurrentPlayer] = useState(username);

  useEffect(() => {
    // Basic demo: simulate another player joining after 3s
    const timer = setTimeout(() => {
      setPlayers((prev) => [...prev, "Econi"]);
    }, 3000);

    console.log(`Player ${username} joined room ${roomId}`);

    return () => clearTimeout(timer);
  }, [username, roomId]);

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2>Multiplayer Quiz</h2>
        <p>Room ID: {roomId}</p>
        <p>Players in Room: {players.join(", ")}</p>
        <p>Current Player: {currentPlayer}</p>
        <p>Waiting for more players... (basic demo)</p>
      </div>
    </Layout>
  );
};

export default MultiplayerQuiz;
