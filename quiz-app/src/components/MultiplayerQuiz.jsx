import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions";

const MultiplayerQuiz = () => {
  const location = useLocation();
  const { username, roomId } = location.state || {};
  const [players, setPlayers] = useState([username]);
  const [currentPlayer, setCurrentPlayer] = useState(username);
  const [questions] = useState(localQuestions); // use local questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({}); // store player answers

  useEffect(() => {
    // This is where socket logic would go
    console.log(`Player ${username} joined room ${roomId}`);
  }, [username, roomId]);

  const currentQuestion = questions[currentIndex];
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
    () => Math.random() - 0.5
  );

  const handleAnswer = (opt) => {
    setSelectedOption(opt);
    setAnswers((prev) => ({ ...prev, [username]: opt }));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption("");
  };

  return (
    <Layout>
      <div>
        <h2>Multiplayer Quiz</h2>
        <p>Room: {roomId}</p>
        <p>Players in room: {players.join(", ")}</p>
        <p>Current Player: {currentPlayer}</p>

        <div>
          <h3>{currentQuestion.question}</h3>
          <ul>
            {options.map((opt, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selectedOption}
                  style={{ backgroundColor: selectedOption === opt ? "#4CAF50" : "#eee" }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleNext} disabled={!selectedOption || currentIndex + 1 >= questions.length}>
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MultiplayerQuiz;
