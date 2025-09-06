// src/components/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SplashScreen.module.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000); // 5-second animation
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <h1>BookMate Quiz App</h1>
      <p>Loading animation...</p>
      {/* You can replace with actual animation */}
    </div>
  );
};

export default SplashScreen;
