import React, { useState, useEffect } from "react";
import { decodeHtmlEntities, shuffleArray } from "../utils/helpers";

function QuizScreen({ questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // start empty

  // --------------------------
  // Load answers when question changes
  // --------------------------
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(
        shuffleArray([
          questions[currentIndex].correct_answer,
          ...questions[currentIndex].incorrect_answers,
        ])
      );
    }
  }, [currentIndex, questions]);

  const handleSelect = (answer) => {
    setSelected(answer);
  };

  const handleNext = () => {
    if (selected === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelected(null);
    } else {
      onFinish(score);
    }
  };

  // --------------------------
  // Safety check: wait for data
  // --------------------------
  if (!questions || questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-screen">
      <h2 className="text-xl font-bold mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h2>

      <p className="mb-4">{decodeHtmlEntities(currentQuestion.question)}</p>

      <div className="space-y-2 mb-4">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleSelect(answer)}
            className={`w-full border p-2 rounded 
              ${selected === answer ? "bg-blue-200" : "bg-white"}
            `}
          >
            {decodeHtmlEntities(answer)}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className={`px-4 py-2 rounded text-white ${
          selected ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
        }`}
      >
        {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  );
}

export default QuizScreen;
