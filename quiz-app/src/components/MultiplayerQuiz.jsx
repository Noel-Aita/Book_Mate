// src/components/MultiplayerQuiz.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MultiplayerQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, socket, players: initialPlayers } = location.state;

  const [players, setPlayers] = useState(initialPlayers || []);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [nextQuestions, setNextQuestions] = useState([]);

  // Receive updates from server
  useEffect(() => {
    if (!socket) return;

    socket.on("playersUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("quizStarted", ({ currentPlayerId, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setCurrentQuestion(question);
    });

    socket.on("nextTurn", ({ currentPlayerId, question }) => {
      setCurrentPlayerId(currentPlayerId);
      setCurrentQuestion(question);
      setSelectedOption("");
    });

    socket.on("quizEnded", (finalPlayers) => {
      navigate("/result", { state: { players: finalPlayers, multiplayer: true } });
    });

    // Clean up
    return () => {
      socket.off("playersUpdate");
      socket.off("quizStarted");
      socket.off("nextTurn");
      socket.off("quizEnded");
    };
  }, [socket]);

  if (!currentQuestion) return <p>Waiting for quiz to start...</p>;

  const isCurrentPlayer = socket.id === currentPlayerId;

  const handleAnswer = (option) => {
    setSelectedOption(option);
    socket.emit("answerQuestion", { roomId, answer: option });
  };

  const handleNextQuestionSelection = (question) => {
    // Send next question selection to server
    socket.emit("selectNextQuestion", { roomId, question });
    setNextQuestions([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Multiplayer Quiz</h2>
      <h3>
        Current Player:{" "}
        {players.find((p) => p.socketId === currentPlayerId)?.username || "Unknown"}
      </h3>

      <div style={{ margin: "20px 0" }}>
        <h4>{currentQuestion.question}</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {[...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
            .sort(() => Math.random() - 0.5)
            .map((opt, idx) => (
              <li key={idx} style={{ margin: "10px 0" }}>
                <button
                  onClick={() => handleAnswer(opt)}
                  disabled={!isCurrentPlayer || !!selectedOption}
                  style={{
                    padding: "10px 20px",
                    width: "100%",
                    backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee",
                    border: "none",
                    borderRadius: 5,
                    cursor: isCurrentPlayer && !selectedOption ? "pointer" : "default",
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Optional: After correct answer, show next question selection */}
      {selectedOption === currentQuestion.correct_answer && isCurrentPlayer && (
        <div style={{ marginTop: 20 }}>
          <h4>Select next question for the next player:</h4>
          {nextQuestions.length === 0
            ? "System will generate questions..."
            : nextQuestions.map((q, idx) => (
                <button key={idx} onClick={() => handleNextQuestionSelection(q)}>
                  {q.question}
                </button>
              ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Scores:</h4>
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
