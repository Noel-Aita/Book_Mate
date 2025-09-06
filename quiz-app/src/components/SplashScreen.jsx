// src/components/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 5000); // 5 sec animation placeholder
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", paddingTop: "40vh" }}>
      <h1>BookMate Quiz App</h1>
      <p>Loading animation placeholder...</p>
    </div>
  );
};

export default SplashScreen;
