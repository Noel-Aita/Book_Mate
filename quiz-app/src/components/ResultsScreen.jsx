// src/components/ResultScreen.jsx
import React from "react";
import bgImage from "../assets/bg.jpg";

function ResultScreen({ winners, onRestart }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">🏆 Game Over!</h2>
        {winners.length > 0 ? (
          <p className="text-lg mb-4">Winner: {winners.join(", ")}</p>
        ) : (
          <p className="text-lg mb-4">No winners this time 😅</p>
        )}

        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
