// src/components/CategoryDifficultySelect.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CategoryDifficultySelect = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // mode passed from previous screen: "single" or "multiplayer"
  const { mode } = location.state || {};

  const [category, setCategory] = useState("General Knowledge");
  const [difficulty, setDifficulty] = useState("easy");

  const categories = [
    "General Knowledge",
    "Science",
    "Math",
    "History",
    "Programming",
  ];

  const difficulties = ["easy", "medium", "hard"];

  const handleStartQuiz = () => {
    if (mode === "single") {
      navigate("/quiz", { state: { mode, category, difficulty } });
    } else if (mode === "multiplayer") {
      navigate("/player-setup-multiplayer", { state: { category, difficulty } });
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Category & Difficulty</h2>

      <div style={{ marginTop: 20 }}>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginLeft: 10, padding: 5 }}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ marginLeft: 10, padding: 5 }}
          >
            {difficulties.map((dif, idx) => (
              <option key={idx} value={dif}>
                {dif}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={handleStartQuiz}
        style={{
          padding: "10px 20px",
          marginTop: 20,
          borderRadius: 5,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default CategoryDifficultySelect;
