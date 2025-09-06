// src/components/MultiplayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { connectSocket } from "../services/socket";
import localQuestions from "../data/localQuestions.js";

const MultiplayerQuiz = ({ setup, category, difficulty }) => {
  const { username, roomId } = setup;
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  // Connect to socket
  useEffect(() => {
    const sock = connectSocket(username);
    setSocket(sock);

    sock.emit("joinRoom", roomId);

    sock.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    sock.on("quizStarted", (data) => {
      setCurrentPlayerId(data.currentPlayerId);
      setQuestion(data.question);
    });

    sock.on("nextTurn", (data) => {
      setCurrentPlayerId(data.currentPlayerId);
      setQuestion(data.question);
      setSelectedOption("");
    });

    sock.on("quizEnded", (finalPlayers) => {
      alert("Quiz ended! Check the results.");
      // You can navigate to ResultScreen here
    });

    return () => {
      sock.disconnect();
    };
  }, [username, roomId]);

  if (!question) return <p>Waiting for quiz to start...</p>;

  const options = [...question.incorrect_answers, question.correct_answer].sort(
    () => Math.random() - 0.5
  );

  const handleAnswer = (opt) => {
    setSelectedOption(opt);
    socket.emit("answerQuestion", { roomId, answer: opt });
  };

  return (
    <div>
      <h3>Room: {roomId}</h3>
      <div>
        <h4>Players:</h4>
        <ul>
          {players.map((p) => (
            <li key={p.username}>
              {p.username} - {p.score}{" "}
              {p.username === currentPlayerId ? "(Current Player)" : ""}
            </li>
          ))}
        </ul>
      </div>

      <h2>{question.question}</h2>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            <button
              disabled={selectedOption || currentPlayerId !== username}
              onClick={() => handleAnswer(opt)}
              style={{
                backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiplayerQuiz;
