// src/components/CategorySelection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelection.module.css";

const CategorySelection = ({ onStartQuiz }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const categories = [
    { id: "9",  name: "General Knowledge" },
    { id: "21", name: "Sports" },
    { id: "23", name: "History" },
    { id: "17", name: "Science & Nature" },
    { id: "22", name: "Geography" },
  ];
  const difficulties = ["easy", "medium", "hard"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !difficulty) return alert("Select both category and difficulty");
    onStartQuiz(category, difficulty);
    navigate("/quiz");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Choose Your Quiz</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Difficulty</label>
            <select
              className={styles.select}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">— Select difficulty —</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.startQuiz}>
            Start Quiz →
          </button>
        </form>

        <button onClick={() => navigate("/setup")} className={styles.backButton}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;
