// src/components/CategorySelection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CategorySelection.module.css";

/**
 * CategorySelection
 * Lets player choose category, difficulty, and optionally join/create a multiplayer room
 *
 * Props:
 * - onStartQuiz(category, difficulty, roomId, isMultiplayer)
 */
const CategorySelection = ({ onStartQuiz }) => {
  const navigate = useNavigate();

  // Local state
  const [category, setCategory] = useState("18"); // Default: Science
  const [difficulty, setDifficulty] = useState("easy");
  const [roomId, setRoomId] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  // Handle quiz start
  const startQuiz = () => {
    if (isMultiplayer && !roomId) {
      alert("Please enter a room ID to join or create a multiplayer room.");
      return;
    }
    // Pass all info to App.jsx
    onStartQuiz(category, difficulty, roomId, isMultiplayer);
    navigate("/quiz"); // Go to QuizScreen
  };

  return (
    <div className={styles.container}>
      <h1>Select Quiz Category & Difficulty</h1>

      {/* Category selection */}
      <div className={styles.field}>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="18">Science</option>
          <option value="23">History</option>
          <option value="21">Sports</option>
          <option value="12">Music</option>
        </select>
      </div>

      {/* Difficulty selection */}
      <div className={styles.field}>
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Multiplayer toggle */}
      <div className={styles.field}>
        <label>
          <input
            type="checkbox"
            checked={isMultiplayer}
            onChange={(e) => setIsMultiplayer(e.target.checked)}
          />
          Play Multiplayer
        </label>
      </div>

      {/* Room ID input for multiplayer */}
      {isMultiplayer && (
        <div className={styles.field}>
          <label>Room ID:</label>
          <input
            type="text"
            placeholder="Enter or create room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
      )}

      <button onClick={startQuiz} className={styles.startBtn}>
        {isMultiplayer ? "Join/Create Room" : "Start Quiz"}
      </button>
    </div>
  );
};

export default CategorySelection;
