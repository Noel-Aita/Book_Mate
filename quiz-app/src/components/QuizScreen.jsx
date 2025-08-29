// src/components/QuizScreen.jsx
import React, { useState, useEffect } from "react";

// Shuffle helper
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

const QuizScreen = ({ questions, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions[current];
      setShuffledAnswers(
        shuffleArray([q.correct_answer, ...q.incorrect_answers])
      );
    }
  }, [current, questions]);

  const handleAnswer = (answer) => {
    if (answer === questions[current].correct_answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      onFinish(score + 1);
    }
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
      <h2 className="text-xl font-bold mb-4">
        Q{current + 1}: {questions[current].question}
      </h2>
      <div className="space-y-2">
        {shuffledAnswers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(answer)}
            className="w-full bg-blue-100 hover:bg-blue-300 text-left p-2 rounded"
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;
