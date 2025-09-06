// src/components/CategoryDifficultySelect.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import BlogSection from "./BlogSection";
import styles from "../styles/CategoryDifficultyScreen.module.css";

const CategoryDifficultySelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleStartQuiz = () => {
    if (!category || !difficulty) {
      alert("Please select both category and difficulty");
      return;
    }
    navigate("/single-player-quiz", {
      state: { username, category, difficulty },
    });
  };

  return (
    <Layout>
      <div
        className={styles.container}
        style={{
          backgroundImage: "url(/assets/category-bg.jpg)",
          backgroundSize: "cover",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h1>Select Category & Difficulty</h1>
        <div className={styles.selection}>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">--Select--</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="history">History</option>
            </select>
          </label>

          <label>
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">--Select--</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <button className={styles.startButton} onClick={handleStartQuiz}>
          Start Quiz
        </button>

        <BlogSection />
      </div>
    </Layout>
  );
};

export default CategoryDifficultySelect;
