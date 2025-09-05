// src/components/QuizScreen.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSocket } from "../services/socket";
import useCountdown from "../hooks/useCountdown";
import styles from "../styles/QuizScreen.module.css";

const QuizScreen = ({ category, difficulty }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get player info from setup
  const { username, roomId } = location.state || {};

  // State
  const [question, setQuestion] = useState(null);
  const [players, setPlayers] = useState([]); // store multiplayer leaderboard
  const [score, setScore] = useState(0);
  const { timeLeft, startTimer, resetTimer } = useCountdown(15);

  useEffect(() => {
    if (roomId) {
      // Multiplayer mode
      const socket = getSocket();

      // Receive a new question from server
      socket.on("newQuestion", (q) => {
        setQuestion(q);
        resetTimer();
        startTimer();
      });

      // Update leaderboard when server sends updates
      socket.on("updateLeaderboard", (data) => {
        setPlayers(data); // array of { username, score }
      });

      // Ask server for the first question
      socket.emit("requestQuestion", { roomId });

      return () => {
        socket.off("newQuestion");
        socket.off("updateLeaderboard");
      };
    } else {
      // Single player mode: fetch from API
      fetch(
        `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`
      )
        .then((res) => res.json())
        .then((data) => {
          setQuestion(data.results[0]);
          resetTimer();
          startTimer();
        });
    }
  }, [roomId, category, difficulty]);

  // Handle answer click
  const handleAnswer = (answer) => {
    if (roomId) {
      // Multiplayer: send answer to server
      const socket = getSocket();
      socket.emit("answer", { roomId, username, answer });
    } else {
      // Single-player: check locally
      if (answer === question.correct_answer) {
        setScore((prev) => prev + 1);
      }
    }
  };

  // End game (when timer ends or all questions done)
  const endGame = () => {
    navigate("/result", { state: { score, players, username, roomId } });
  };

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft]);

  if (!question) return <div>Loading question...</div>;

  return (
    <div className={styles.container}>
      <h2>{roomId ? `Room: ${roomId}` : "Single Player Quiz"}</h2>
      <h3>{question.question}</h3>

      <div>
        {question.incorrect_answers
          .concat(question.correct_answer)
          .sort(() => Math.random() - 0.5)
          .map((option, i) => (
            <button key={i} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
      </div>

      <p>⏳ Time left: {timeLeft}s</p>
      {!roomId && <p>Score: {score}</p>}

      {roomId && (
        <div>
          <h3>Leaderboard</h3>
          <ul>
            {players.map((p) => (
              <li key={p.username}>
                {p.username}: {p.score}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={endGame}>End Game</button>
    </div>
  );
};

export default QuizScreen;
