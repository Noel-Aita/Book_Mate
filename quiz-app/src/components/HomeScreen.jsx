import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomeScreen.module.css";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h1 className={styles.title}>Welcome to BookMate Quiz! 🎉</h1>
        <p>Test your knowledge and learn new things every day.</p>
        <button className={styles.startButton} onClick={() => navigate("/LoginScreen")}>
          Login / Signup
        </button>
      </div>

      <div className={styles.rightPane}>
        <h3 className={styles.blogTitle}>Daily Blogs</h3>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img src="/images/science.jpg" alt="Science" className={styles.blogImage} />
            <p>Explore fascinating science facts and experiments daily.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/art.jpg" alt="Arts" className={styles.blogImage} />
            <p>Discover music, arts, and photography insights.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/tech-3.jpg" alt="Tech" className={styles.blogImage} />
            <p>Learn about the latest technology and innovations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
