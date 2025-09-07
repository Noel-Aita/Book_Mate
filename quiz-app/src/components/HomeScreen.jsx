// src/components/HomeScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeScreen.module.css";

/**
 * Displays the landing page with:
 * - Welcome message
 * - Login / Signup button
 * - Blogs on the right side
 */
const HomeScreen = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  return (
    <div className={styles.container}>
      {/* Left: Welcome + navigation */}
      <div className={styles.leftPane}>
        <h1 className={styles.title}>BookMate Quiz! </h1>
        <p className ={styles.message}>Test your knowledge and learn new things every day.</p>
        <button
          className={styles.startButton}
          onClick={() => navigate("/login")} // navigate to login
        >
          Login / Signup
        </button>
      </div>

      {/* Right: Blogs */}
      <div className={styles.rightPane}>
        <h3 className={styles.blogTitle}>Daily Blogs</h3>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img src="/images/images.jpeg" alt="Science" className={styles.blogImage} />
            <p>Explore fascinating science facts and experiments daily.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/logo.jpg" alt="Arts" className={styles.blogImage} />
            <p>Discover music, arts, and photography insights.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/learning.jpg" alt="Tech" className={styles.blogImage} />
            <p>Learn about the latest technology and innovations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
