// src/components/BlogSection.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/BlogSection.module.css";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Example using GNews API (replace with your API key)
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=education&lang=en&max=5&apikey=YOUR_API_KEY`
        );
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        // fallback dummy blogs
        setBlogs([
          {
            title: "Learn React in 2025",
            description: "A comprehensive guide to React development for beginners.",
            url: "#",
            image: "",
          },
          {
            title: "Top 10 JavaScript Tips",
            description: "Enhance your JS skills with these pro tips.",
            url: "#",
            image: "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading educational blogs...</p>;

  return (
    <div className={styles.blogContainer}>
      <h3>Educational Blogs</h3>
      <div className={styles.blogList}>
        {blogs.map((blog, idx) => (
          <a
            key={idx}
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.blogItem}
          >
            {blog.image && <img src={blog.image} alt={blog.title} className={styles.blogImage} />}
            <div>
              <h4>{blog.title}</h4>
              <p>{blog.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
