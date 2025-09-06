import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/CategoryDifficultyScreen.module.css";

const CategoryDifficultyScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleNext = () => {
    if (!category || !difficulty) return alert("Select category and difficulty");

    if (mode === "single") {
      navigate("/single-setup", { state: { category, difficulty } });
    } else {
      navigate("/multi-setup", { state: { category, difficulty } });
    }
  };

  return (
    <div className={styles.categoryContainer}>
      <h2>Select Category & Difficulty</h2>
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        placeholder="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default CategoryDifficultyScreen;
