// src/components/CategorySelection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySelection.module.css";

const CATEGORIES = [
  { id: "9",  name: "General Knowledge",          icon: "🧠" },
  { id: "10", name: "Entertainment: Books",        icon: "📚" },
  { id: "11", name: "Entertainment: Film",         icon: "🎬" },
  { id: "12", name: "Entertainment: Music",        icon: "🎵" },
  { id: "13", name: "Entertainment: Musicals",     icon: "🎭" },
  { id: "14", name: "Entertainment: Television",   icon: "📺" },
  { id: "15", name: "Entertainment: Video Games",  icon: "🎮" },
  { id: "16", name: "Entertainment: Board Games",  icon: "♟️" },
  { id: "17", name: "Science & Nature",            icon: "🔬" },
  { id: "18", name: "Science: Computers",          icon: "💻" },
  { id: "19", name: "Science: Mathematics",        icon: "📐" },
  { id: "20", name: "Mythology",                   icon: "⚡" },
  { id: "21", name: "Sports",                      icon: "⚽" },
  { id: "22", name: "Geography",                   icon: "🌍" },
  { id: "23", name: "History",                     icon: "📜" },
  { id: "24", name: "Politics",                    icon: "🏛️" },
  { id: "25", name: "Art",                         icon: "🎨" },
  { id: "26", name: "Celebrities",                 icon: "⭐" },
  { id: "27", name: "Animals",                     icon: "🦁" },
  { id: "28", name: "Vehicles",                    icon: "🚗" },
  { id: "29", name: "Entertainment: Comics",       icon: "💥" },
  { id: "30", name: "Science: Gadgets",            icon: "📱" },
  { id: "31", name: "Anime & Manga",               icon: "🌸" },
  { id: "32", name: "Cartoon & Animations",        icon: "🎠" },
];

const DIFFICULTIES = ["easy", "medium", "hard"];

const CategorySelection = ({ onStartQuiz }) => {
  const navigate = useNavigate();
  const [category,   setCategory]   = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mode,       setMode]       = useState("standard"); // "standard" | "timed"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !difficulty) return alert("Select both category and difficulty");
    onStartQuiz(category, difficulty);
    if (mode === "timed") {
      navigate("/timed-quiz");
    } else {
      navigate("/quiz");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Choose Your Quiz</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Mode toggle */}
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === "standard" ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("standard")}
            >
              🎯 Standard
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === "timed" ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("timed")}
            >
              ⚡ Timed Challenge
            </button>
          </div>
          {mode === "timed" && (
            <p className={styles.modeHint}>Answer as many as you can in 60 seconds!</p>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">— Select category —</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Difficulty</label>
            <select className={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">— Select difficulty —</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.startQuiz}>
            {mode === "timed" ? "⚡ Start Challenge →" : "Start Quiz →"}
          </button>
        </form>

        <button onClick={() => navigate("/setup")} className={styles.backButton}>← Back</button>
      </div>
    </div>
  );
};

export default CategorySelection;
