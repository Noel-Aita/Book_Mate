// src/components/HomeScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "../styles/HomeScreen.module.css";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h1>Welcome to BookMate Quiz App</h1>
        <p>Select Login or Signup to continue:</p>
        <button
          className={styles.homeButton}
          onClick={() => navigate("/login")}
        >
          Login / Signup
        </button>
      </div>
    </Layout>
  );
};

export default HomeScreen;
