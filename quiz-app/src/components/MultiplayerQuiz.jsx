// src/components/MultiplayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { connectSocket } from "../services/socket";
import localQuestions from "../data/localQuestions.js";

const MultiplayerQuiz = ({ setup, category, difficulty }) => {
  const { username, roomId } = setup;
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [nextQuestionOptions, setNextQuestionOptions] = useState([]);

  useEffect(() => {
    const s = connectSocket(username);
    setSocket(s);

    s.emit("joinRoom", roomId);

    // Listen for players updates
    s.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Listen for quiz start
    s.on("quizStarted", ({ currentPlayerId, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setCurrentQuestion(question);
      generateNextQuestionOptions(question);
    });

    // Listen for next turn
    s.on("nextTurn", ({ currentPlayerId, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setCurrentQuestion(question);
      setSelectedOption("");
      generateNextQuestionOptions(question);
    });

    // Listen for quiz end
    s.on("quizEnded", (finalPlayers) => {
      alert("Quiz ended! Check console for final scores.");
      console.log("Final Scores:", finalPlayers);
    });

    return () => s.disconnect();
    // eslint-disable-next-line
  }, []);

  const generateNextQuestionOptions = (currentQ) => {
    // For simplicity, pick 4 random questions including current one
    const options = localQuestions
      .filter((q) => q.question !== currentQ.question)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    options.push(currentQ);
    setNextQuestionOptions(options.sort(() => 0.5 - Math.random()));
  };

  const handleAnswer = (option) => {
    if (!socket || !currentQuestion) return;

    setSelectedOption(option);

    socket.emit("answerQuestion", {
      roomId,
      answer: option,
    });
  };

  const handleSelectNextQuestion = (question) => {
    // Only current player can select next question
    if (currentPlayerId !== socket.id) return;

    socket.emit("startQuiz", {
      roomId,
      questions: [question, ...localQuestions.filter((q) => q.question !== question).slice(0, 4)],
    });
  };

  if (!currentQuestion) return <p>Waiting for quiz to start...</p>;

  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
    () => Math.random() - 0.5
  );

  useEffect(() => {
  if (!socket) return;

  socket.on("quizEnded", (finalPlayers) => {
    console.log("Final Scores:", finalPlayers);
    // Navigate to ResultScreen
    navigate("/result", {
      state: { mode: "multi", players: finalPlayers },
    });
  });
    }, [socket, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room ID: {roomId}</h2>

      <div>
        <h3>Players:</h3>
        <ul>
          {players.map((p) => (
            <li key={p.username}>
              {p.username} - {p.score} {p.username === username ? "(You)" : ""}
              {p.socketId === currentPlayerId ? " 🔹 answering" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>{currentQuestion.question}</h3>
        <ul>
          {options.map((opt, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleAnswer(opt)}
                disabled={selectedOption !== "" || currentPlayerId !== socket.id}
                style={{
                  backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
                  marginBottom: "5px",
                  padding: "8px 12px",
                  borderRadius: 5,
                  cursor: selectedOption === "" && currentPlayerId === socket.id ? "pointer" : "not-allowed",
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Current player can select next question */}
      {selectedOption === currentQuestion.correct_answer && currentPlayerId === socket.id && (
        <div>
          <h4>Select Next Question for next player:</h4>
          <ul>
            {nextQuestionOptions.map((q, idx) => (
              <li key={idx}>
                <button onClick={() => handleSelectNextQuestion(q)}>{q.question}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiplayerQuiz;
