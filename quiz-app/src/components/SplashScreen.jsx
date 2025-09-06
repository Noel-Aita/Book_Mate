// src/components/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to HomeScreen after 5 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#2196F3",
        color: "#fff",
      }}
    >
      {/* Placeholder animation */}
      <div
        style={{
          width: 100,
          height: 100,
          border: "5px solid #fff",
          borderTop: "5px solid #e0f7fa",
          borderRadius: "50%",
          animation: "spin 2s linear infinite",
          marginBottom: 20,
        }}
      ></div>

      <h1>Book Mate Quiz</h1>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
