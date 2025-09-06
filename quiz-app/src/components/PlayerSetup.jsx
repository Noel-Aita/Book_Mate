// src/components/PlayerSetup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerSetup = ({ onSetup }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    const username = prompt("Enter your name:");
    if (!username) return alert("Please enter a name");

    onSetup({ username }); // no roomId for single-player
    navigate("/category");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Single Player Setup</h2>
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
};

export default PlayerSetup;
