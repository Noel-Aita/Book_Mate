// src/components/Layout.jsx
import React from "react";
import styles from "../styles/HomeScreen.module.css"; // reuse your existing styles

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Left pane: the actual page (content changes per route) */}
      <div className={styles.leftPane}>{children}</div>

      {/* Right pane: shared Daily Blogs */}
      <div className={styles.rightPane}>
        <h3 className={styles.blogTitle}>Daily Blogs</h3>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img
              src="/images/science.jpg"
              alt="Science"
              className={styles.blogImage}
            />
            <p>Explore fascinating science facts and experiments daily.</p>
          </div>
          <div className={styles.blogCard}>
            <img
              src="/images/art.jpg"
              alt="Arts"
              className={styles.blogImage}
            />
            <p>Discover music, arts, and photography insights.</p>
          </div>
          <div className={styles.blogCard}>
            <img
              src="/images/tech-3.jpg"
              alt="Tech"
              className={styles.blogImage}
            />
            <p>Learn about the latest technology and innovations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
