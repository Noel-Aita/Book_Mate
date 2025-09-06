// src/components/ModeSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BlogSection from "./BlogSection";

const ModeSelect = () => {
  const navigate = useNavigate();

  const handleSelectMode = (mode) => {
    navigate(`/category?mode=${mode}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h2>Select Game Mode</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button
            onClick={() => handleSelectMode("single")}
            style={{
              padding: "15px 30px",
              fontSize: 16,
              borderRadius: 5,
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Single Player
          </button>

          <button
            onClick={() => handleSelectMode("multi")}
            style={{
              padding: "15px 30px",
              fontSize: 16,
              borderRadius: 5,
              border: "none",
              backgroundColor: "#2196F3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Multiplayer
          </button>
        </div>
      </div>

      {/* BlogSection visible on all screens except ResultScreen */}
      <BlogSection />
    </div>
  );
};

export default ModeSelect;
