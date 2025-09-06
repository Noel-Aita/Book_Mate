// src/components/QuizScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SinglePlayerQuiz from "./SinglePlayerQuiz";
import PlayerSetupMultiplayer from "./PlayerSetupMultiplayer";

const QuizScreen = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.state?.mode;

  if (!user) {
    return <p>Please login to play the quiz.</p>;
  }

  if (!mode) {
    // If mode not set, go back to mode selection
    navigate("/select");
    return null;
  }

  return (
    <div>
      {mode === "single" && <SinglePlayerQuiz />}
      {mode === "multi" && <PlayerSetupMultiplayer onSetup={() => {}} />}
    </div>
  );
};

export default QuizScreen;
