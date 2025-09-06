import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connectSocket } from "../services/socket";
import Layout from "./Layout";

const MultiplayerQuiz = () => {
  const location = useLocation();
  const { username, roomId } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("joinRoom", { username, roomId });

    socket.on("updatePlayers", (players) => setPlayers(players));
    socket.on("nextQuestion", (question) => setMessage(question));

    return () => socket.disconnect();
  }, [username, roomId]);

  return (
    <Layout>
      <div>
        <h2>Multiplayer Quiz</h2>
        <p>Room: {roomId}</p>
        <p>Player: {username}</p>
        <p>Waiting for more players...</p>
        <ul>
          {players.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {message && <p>Next question: {message}</p>}
      </div>
    </Layout>
  );
};

export default MultiplayerQuiz;
