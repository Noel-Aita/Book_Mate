// src/components/HomeScreen.jsx
import React, { useState } from "react";
import bgImage from "../assets/bg.jpg"; // Background image
import logo from "../assets/logo.png"; // Placeholder logo

function HomeScreen({ onStart }) {
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ category, difficulty, numQuestions });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo area */}
      <img src={logo} alt="Quiz Logo" className="w-32 h-32 mb-6" />

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎓 BrainBoost Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Select */}
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="any">Any</option>
              <option value="9">General Knowledge</option>
              <option value="21">Sports</option>
              <option value="23">History</option>
            </select>
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="block mb-1 font-semibold">Difficulty</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block mb-1 font-semibold">Number of Questions</label>
            <input
              type="number"
              min="3"
              max="20"
              className="w-full border rounded-lg px-3 py-2"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300"
          >
            🚀 Start Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomeScreen;
