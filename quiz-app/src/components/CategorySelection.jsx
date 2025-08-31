// src/components/CategorySelection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelection.module.css";

/**
 * Lets player select category & difficulty.
 * Navigates to QuizScreen.
 */
const CategorySelection = ({ onStartQuiz }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const categories = [
    { id: "9", name: "General Knowledge" },
    { id: "21", name: "Sports" },
    { id: "23", name: "History" },
    { id: "17", name: "Science & Nature" },
    { id: "22", name: "Geography" },
  ];
  const difficulties = ["easy", "medium", "hard"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !difficulty) return alert("Select both category and difficulty");
    onStartQuiz(category, difficulty); // update App.jsx
    navigate("/quiz"); // go to quiz
  };

  return (
    <div className={styles.container}>
      <form className={styles.firstForm}>
      <h2 className={styles.chooseQuiz}>Choose Quiz</h2>
      </form>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Select --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">-- Select --</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <button className={styles.startQuiz} type="submit">Start Quiz</button>
      </form>
      <button onClick={() => navigate("/setup")} className={styles.backButton}>
        Back to Player Setup
      </button>
    </div>
  );
};

export default CategorySelection;
