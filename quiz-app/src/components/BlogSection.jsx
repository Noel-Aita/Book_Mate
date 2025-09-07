// src/components/BlogSection.jsx
import React from "react";
import styles from "./BlogSection.module.css";

const blogs = [
  {
    img: "/assets/blog1.jpg",
    title: "New Exoplanet Discovered in the Habitable Zone",
    description:
      "Astronomers have discovered a potentially habitable exoplanet using the latest space telescope data. Learn about its unique features and what it means for future exploration.",
  },
  {
    img: "/assets/blog2.jpg",
    title: "Digital Art Exhibition Goes Global",
    description:
      "A virtual art exhibition is connecting artists from around the world. Explore trending digital artworks and gain inspiration from modern art movements.",
  },
  {
    img: "/assets/blog3.jpg",
    title: "Breakthrough in Renewable Energy Storage",
    description:
      "Researchers have developed a new battery technology capable of storing renewable energy more efficiently, bringing us closer to sustainable power solutions.",
  },
];

const BlogSection = () => {
  return (
    <div className={styles.blogContainer}>
      <h3 className={styles.blogTitle}>Daily Blogs</h3>
      <div className={styles.blogList}>
        {blogs.map((blog, idx) => (
          <div key={idx} className={styles.blogCard}>
            <img src={blog.img} alt={blog.title} className={styles.blogImage} />
            <h4>{blog.title}</h4>
            <p>{blog.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
