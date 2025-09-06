import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PlayerSetupSingle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};

  const [username, setUsername] = useState("");

  const handleStart = () => {
    if (username.trim()) {
      navigate("/quiz", { state: { mode, username } });
    }
  };

  return (
    <div>
      <h2>Single Player Setup</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
};

export default PlayerSetupSingle;
