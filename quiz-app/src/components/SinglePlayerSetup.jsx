// src/components/SinglePlayerSetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SinglePlayerSetup = ({ onSetup }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!username) return alert("Enter a username");
    onSetup({ username }); // Save player info
    navigate("/quiz");     // Navigate to quiz (single-player)
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Single Player</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
};

export default SinglePlayerSetup;
