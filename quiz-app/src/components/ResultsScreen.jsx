import React from "react";

function ResultsScreen({ score, total, onRestart }) {
  return (
    <div className="results-screen text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>

      {/* Display Score */}
      <p className="text-lg mb-4">
        You scored <span className="font-bold">{score}</span> out of{" "}
        <span className="font-bold">{total}</span>
      </p>

      {/* Performance Feedback */}
      {score / total >= 0.8 ? (
        <p className="text-green-600 font-semibold mb-4">
          🎉 Excellent work!
        </p>
      ) : score / total >= 0.5 ? (
        <p className="text-yellow-600 font-semibold mb-4">
          👍 Good effort, keep practicing!
        </p>
      ) : (
        <p className="text-red-600 font-semibold mb-4">
          😅 Don’t worry, try again and you’ll improve!
        </p>
      )}

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default ResultsScreen;
