// src/components/CategoryDifficultySelect.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryDifficultySelect = ({ setup, setSetup }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(setup.category || "");
  const [difficulty, setDifficulty] = useState(setup.difficulty || "");

  const handleStart = () => {
    if (!category || !difficulty) {
      alert("Please select both category and difficulty.");
      return;
    }

    // Update the quiz setup state
    setSetup({ ...setup, category, difficulty });

    // Navigate to quiz or multiplayer setup based on mode
    if (setup.mode === "multi") {
      navigate("/multiplayer-setup");
    } else {
      navigate("/quiz");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Category and Difficulty</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">--Select--</option>
            <option value="general">General Knowledge</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="math">Math</option>
            <option value="programming">Programming</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">--Select--</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: "10px 20px",
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
