import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score = 0, total = 0, username = "Player" } = location.state || {};

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Quiz Results</h2>
      <p>
        <strong>{username}</strong>, you scored {score} out of {total}
      </p>
      <button onClick={() => navigate("/select")}>Play Again</button>
    </div>
  );
};

export default ResultScreen;
