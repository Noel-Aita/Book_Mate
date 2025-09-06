// src/components/ResultScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get score and total questions from state
  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quiz Completed!</h2>
      <p>
        You scored {score} out of {total}
      </p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            borderRadius: 5,
            border: "none",
            backgroundColor: "#2196F3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/select")}
          style={{
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
