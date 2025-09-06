// src/components/HomeScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BlogSection from "./BlogSection";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Book Mate Quiz App!</h1>
      <p>Select Login or Signup to continue</p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            borderRadius: 5,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#2196F3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Signup
        </button>
      </div>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default HomeScreen;
