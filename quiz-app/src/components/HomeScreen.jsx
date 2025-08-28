import React, { useState } from "react";

function HomeScreen({ onStart }) {
  // ------------------------------
  // Local state to store user selections
  // ------------------------------
  const [category, setCategory] = useState("9"); // default: General Knowledge
  const [difficulty, setDifficulty] = useState("easy");
  const [amount, setAmount] = useState(5);

  // ------------------------------
  // Handle form submission
  // ------------------------------
  const handleStart = (e) => {
    e.preventDefault(); // prevent page reload
    // Pass selected settings back to App.jsx
    onStart({ category, difficulty, amount });
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🎯 Welcome to Quiz App</h1>
      <form onSubmit={handleStart} className="space-y-4">
        
        {/* Category Selection */}
        <div>
          <label className="block font-medium mb-1">Select Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="23">History</option>
            <option value="17">Science & Nature</option>
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block font-medium mb-1">Select Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block font-medium mb-1">Number of Questions</label>
          <input
            type="number"
            min="1"
            max="20"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Start Quiz Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          🚀 Start Quiz
        </button>
      </form>
    </div>
  );
}

export default HomeScreen;
