import React from "react";
import { useLocation } from "react-router-dom";
import SinglePlayerQuiz from "./SinglePlayerQuiz";
import MultiplayerQuiz from "./MultiplayerQuiz";

const QuizScreen = () => {
  const location = useLocation();
  const { mode, username, roomId } = location.state || {};

  if (mode === "multi") {
    return <MultiplayerQuiz username={username} roomId={roomId} />;
  }

  return <SinglePlayerQuiz username={username} />;
};

export default QuizScreen;
