// src/components/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SplashScreen.module.css";

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
    <div className={styles.splashContainer}>
      {/* Placeholder animation */}
      <div className={styles.logo}>
        {/* Example animation: spinning circle */}
        <div className={styles.spinner}></div>
        <h1>BookMate Quiz App</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
