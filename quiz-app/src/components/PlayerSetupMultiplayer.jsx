// src/components/PlayerSetupMultiplayer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import BlogSection from "./BlogSection";
import styles from "../styles/PlayerSetupMultiplayer.module.css";
import { initSocket, getSocket } from "../services/socket";

const PlayerSetupMultiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, category, difficulty } = location.state || {};

  const [room, setRoom] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate("/login"); // enforce authentication
      return;
    }

    const socket = initSocket(username); // pass username for auth
    setSocketConnected(true);

    socket.on("joinedRoom", (roomName) => {
      navigate("/multiplayer", {
        state: { username, room: roomName, category, difficulty },
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [username, navigate, category, difficulty]);

  const handleJoinRoom = () => {
    if (!room.trim()) {
      alert("Please enter a room name");
      return;
    }
    const socket = getSocket();
    socket.emit("joinRoom", room);
  };

  return (
    <Layout>
      <div
        className={styles.setupContainer}
        style={{ backgroundImage: "url('/assets/multiplayer-setup-bg.jpg')" }}
      >
        <h2>Welcome, {username}</h2>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleJoinRoom} disabled={!socketConnected}>
          Join Room
        </button>
      </div>
      <BlogSection />
    </Layout>
  );
};

export default PlayerSetupMultiplayer;