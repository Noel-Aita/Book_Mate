// src/components/MultiplayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connectSocket } from "../services/socket";

const MultiplayerQuiz = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, category, difficulty } = location.state || {};

  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [nextQuestionOptions, setNextQuestionOptions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    if (!user || !roomId) {
      navigate("/login");
      return;
    }

    const s = connectSocket(user.username);
    setSocket(s);

    s.emit("joinRoom", roomId);

    s.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    s.on("quizStarted", ({ currentPlayerId, players, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setPlayers(players);
      setQuestion(question);
    });

    s.on("nextTurn", ({ currentPlayerId, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setQuestion(question);
      setSelectedOption("");
      setNextQuestionOptions([]);
    });

    s.on("quizEnded", (finalScores) => {
      setQuizEnded(true);
      navigate("/result", { state: { score: finalScores.find(p => p.username === user.username)?.score || 0, total: finalScores.length } });
    });

    return () => s.disconnect();
  }, []);

  if (!question) return <p>Waiting for question...</p>;

  const options = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

  const handleAnswer = (opt) => {
    setSelectedOption(opt);
    socket.emit("answerQuestion", { roomId, answer: opt });

    // Generate next question options only if answer correct
    if (opt === question.correct_answer) {
      // Example: simple next question generator
      const generated = [
        { question: "Next Q1", correct_answer: "A", incorrect_answers: ["B", "C", "D"] },
        { question: "Next Q2", correct_answer: "B", incorrect_answers: ["A", "C", "D"] },
        { question: "Next Q3", correct_answer: "C", incorrect_answers: ["A", "B", "D"] },
      ];
      setNextQuestionOptions(generated);
    }
  };

  const handleNextQuestionSelect = (q) => {
    // Emit selected question to server for next player
    socket.emit("startQuiz", { roomId, questions: [q] });
    setNextQuestionOptions([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Multiplayer Quiz</h2>
      <p>Room: {roomId}</p>
      <p>Current Player: {currentPlayerId === socket.id ? "You" : players.find(p => p.socketId === currentPlayerId)?.username}</p>

      <div style={{ marginTop: 20 }}>
        <h3>{question.question}</h3>
        <ul>
          {options.map((opt, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleAnswer(opt)}
                disabled={selectedOption || currentPlayerId !== socket.id}
                style={{
                  backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
                  padding: "8px 12px",
                  margin: "5px 0",
                  cursor: currentPlayerId === socket.id ? "pointer" : "not-allowed",
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {nextQuestionOptions.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Choose the next question for the next player:</h4>
          {nextQuestionOptions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleNextQuestionSelect(q)}
              style={{
                padding: "5px 10px",
                marginRight: 5,
                marginTop: 5,
                borderRadius: 4,
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {q.question}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h4>Players & Scores</h4>
        <ul>
          {players.map((p, idx) => (
            <li key={idx}>
              {p.username}: {p.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiplayerQuiz;
