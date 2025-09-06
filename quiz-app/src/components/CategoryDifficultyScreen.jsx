// src/components/CategoryDifficultyScreen.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import styles from "../styles/CategoryDifficultyScreen.module.css";

const CategoryDifficultyScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};

  const [category, setCategory] = useState("general");
  const [difficulty, setDifficulty] = useState("easy");

  const handleContinue = () => {
    if (mode === "single") {
      navigate("/quiz", { state: { mode, category, difficulty } });
    } else if (mode === "multi") {
      navigate("/multiplayer-setup", { state: { mode, category, difficulty } });
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Select Category & Difficulty</h2>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="general">General Knowledge</option>
            <option value="science">Science</option>
            <option value="math">Math</option>
          </select>
        </div>
        <div>
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button onClick={handleContinue}>Continue</button>
      </div>
    </Layout>
  );
};

export default CategoryDifficultyScreen;
