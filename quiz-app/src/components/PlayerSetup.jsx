// src/components/PlayerSetup.jsx
import React, { useState } from "react";
import bgImage from "../assets/bg.jpg";

function PlayerSetup({ onPlayersReady }) {
  const [players, setPlayers] = useState([""]);
  
  const handleAddPlayer = () => setPlayers([...players, ""]);
  const handleChange = (value, index) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validPlayers = players.filter((p) => p.trim() !== "");
    if (validPlayers.length < 2) {
      alert("At least 2 players required!");
      return;
    }
    onPlayersReady(validPlayers);
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          👥 Add Players
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {players.map((player, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Player ${i + 1} name`}
              className="w-full border rounded-lg px-3 py-2"
              value={player}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddPlayer}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            ➕ Add Another Player
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300"
          >
            ✅ Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerSetup;
