import React from "react";
import BlogSection from "./BlogSection";
import { useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideBlog = location.pathname === "/results";

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.mainContent}>{children}</div>
      {!hideBlog && (
        <div className={styles.blogSidebar}>
          <BlogSection />
        </div>
      )}
    </div>
  );
};

export default Layout;
