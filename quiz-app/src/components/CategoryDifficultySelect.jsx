// src/components/CategoryDifficultySelect.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const categories = [
  "General Knowledge",
  "Science",
  "Mathematics",
  "History",
  "Programming",
];

const difficulties = ["easy", "medium", "hard"];

const CategoryDifficultySelect = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "single"; // default to single

  const [category, setCategory] = useState(categories[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);

  if (!user) return <p>Please login to select category and difficulty.</p>;

  const handleStart = () => {
    if (mode === "single") {
      navigate("/quiz", { state: { mode, category, difficulty } });
    } else if (mode === "multi") {
      navigate("/player-setup-multiplayer", { state: { mode, category, difficulty } });
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Select Category & Difficulty</h2>

      <div style={{ margin: "20px 0" }}>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficulties.map((diff, idx) => (
              <option key={idx} value={diff}>{diff}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
        onClick={handleStart}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default CategoryDifficultySelect;
