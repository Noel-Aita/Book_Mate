import React from "react";

const MultiplayerQuiz = ({ username, roomId }) => {
  return (
    <div>
      <h2>Multiplayer Quiz</h2>
      <p>Player: {username}</p>
      <p>Room ID: {roomId}</p>
      <p>Waiting for more players... (basic demo)</p>
    </div>
  );
};

export default MultiplayerQuiz;
