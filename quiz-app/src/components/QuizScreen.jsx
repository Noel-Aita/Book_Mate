// src/components/QuizScreen.jsx
import React, { useState } from "react";
import bgImage from "../assets/bg.jpg";

function QuizScreen({ questions, players, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [activePlayers, setActivePlayers] = useState(players);

  const handleAnswer = (answer, correct) => {
    if (answer !== correct) {
      // ❌ Remove player if wrong
      setActivePlayers(activePlayers.slice(1));
    } else {
      // ✅ Rotate turn to next player
      setActivePlayers([...activePlayers.slice(1), activePlayers[0]]);
    }

    // If no players left OR last question → finish
    if (activePlayers.length === 1 || currentQ === questions.length - 1) {
      onFinish(activePlayers);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const q = questions[currentQ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 text-center">
          {q.question}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[...q.incorrect_answers, q.correct_answer]
            .sort(() => Math.random() - 0.5)
            .map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt, q.correct_answer)}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {opt}
              </button>
            ))}
        </div>

        {/* Show current player */}
        <div className="mt-6 text-center font-bold">
          🎯 Current Player: {activePlayers[0]}
        </div>
      </div>
    </div>
  );
}

export default QuizScreen;
