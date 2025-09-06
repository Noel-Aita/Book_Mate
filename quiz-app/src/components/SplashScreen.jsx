// src/components/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SplashScreen.module.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // Navigate to HomeScreen after 5 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <img
        src="/assets/splash.jpg"
        alt="Splash"
        className={styles.splashImage}
      />
    </div>
  );
};

export default SplashScreen;
