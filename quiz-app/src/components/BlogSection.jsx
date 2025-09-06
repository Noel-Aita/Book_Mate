// src/components/BlogSection.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/BlogSection.module.css";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Example: using free NewsAPI or placeholder API for educational content
        const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=5");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();

        // Map relevant fields
        const formatted = data.results.map((item) => ({
          title: item.title,
          url: item.url,
          image: item.imageUrl || "",
        }));

        setBlogs(formatted);
      } catch (err) {
        console.error("Blog fetch failed:", err);
        // Fallback blogs
        setBlogs([
          { title: "Sample Blog 1", url: "#", image: "" },
          { title: "Sample Blog 2", url: "#", image: "" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className={styles.blogContainer}>
      <h3>Educational Blogs</h3>
      <ul>
        {blogs.map((blog, idx) => (
          <li key={idx} className={styles.blogItem}>
            {blog.image && <img src={blog.image} alt={blog.title} className={styles.blogImage} />}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSection;
