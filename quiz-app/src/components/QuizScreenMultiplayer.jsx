import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSocket } from "../services/socket";

const QuizScreenMultiplayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { roomId, username, questions } = state; // passed from setup
  const socket = getSocket();

  const [assignedQuestion, setAssignedQuestion] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [myTurn, setMyTurn] = useState(false);
  const [turnTimer, setTurnTimer] = useState(15);
  const [scores, setScores] = useState({}); // username: score

  // Listen to socket events
  useEffect(() => {
    socket.emit("startMultiplayer", { roomId, questions });

    socket.on("currentTurn", ({ currentPlayer }) => {
      setCurrentPlayer(currentPlayer);
      setMyTurn(currentPlayer === username);
      setTurnTimer(15);
    });

    socket.on("assignQuestion", (question) => setAssignedQuestion(question));

    socket.on("gameOver", (finalScores) => {
      navigate("/result", { state: { scores: finalScores, totalQuestions: questions.length } });
    });

    return () => {
      socket.off("currentTurn");
      socket.off("assignQuestion");
      socket.off("gameOver");
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (!myTurn || !assignedQuestion) return;
    const timer = setInterval(() => {
      setTurnTimer(t => {
        if (t <= 1) {
          handlePassTurn();
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [myTurn, assignedQuestion]);

  function handleAnswer(answer) {
    if (!myTurn) return;
    const correct = answer === assignedQuestion.correct_answer;
    socket.emit("answerQuestion", {
      roomId,
      socketId: socket.id,
      questionIndex: questions.findIndex(q => q === assignedQuestion),
      correct,
    });
    setAssignedQuestion(null);
  }

  function handlePassTurn() {
    socket.emit("answerQuestion", {
      roomId,
      socketId: socket.id,
      questionIndex: questions.findIndex(q => q === assignedQuestion),
      correct: false,
    });
    setAssignedQuestion(null);
  }

  return (
    <div>
      <h2>Multiplayer Quiz</h2>
      <p>Current player: {currentPlayer} {myTurn ? "(Your turn!)" : ""}</p>
      <p>Timer: {turnTimer}s</p>

      {assignedQuestion && myTurn && (
        <div>
          <h3>{assignedQuestion.question}</h3>
          {assignedQuestion.answers.map((a) => (
            <button key={a} onClick={() => handleAnswer(a)}>{a}</button>
          ))}
        </div>
      )}

      <h3>Scores</h3>
      {Object.entries(scores).map(([player, score]) => (
        <p key={player}>{player}: {score} {player === currentPlayer ? "(Answering)" : ""}</p>
      ))}
    </div>
  );
};

export default QuizScreenMultiplayer;
