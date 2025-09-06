// src/components/QuizScreen.jsx
import React from "react";
import SinglePlayerQuiz from "./SinglePlayerQuiz";
import MultiplayerQuiz from "./MultiplayerQuiz";
import BlogSection from "./BlogSection";

const QuizScreen = ({ mode, setup }) => {
  const { category, difficulty } = setup;

  if (!mode) {
    return <p>Please select a mode before starting the quiz.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {mode === "single" ? "Single Player Quiz" : "Multiplayer Quiz"}
      </h2>
      <p>Category: {category || "N/A"} | Difficulty: {difficulty || "N/A"}</p>

      {/* Render appropriate quiz mode */}
      {mode === "single" && (
        <SinglePlayerQuiz category={category} difficulty={difficulty} />
      )}
      {mode === "multi" && (
        <MultiplayerQuiz setup={setup} category={category} difficulty={difficulty} />
      )}

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default QuizScreen;
