// src/components/BlogSection.jsx
import React, { useEffect, useState } from "react";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Example public API for educational articles
        const res = await fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=5");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Blog fetch failed:", err);
        // Fallback static blogs
        setBlogs([
          { id: 1, title: "Fallback Blog 1", url: "#" },
          { id: 2, title: "Fallback Blog 2", url: "#" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div
      style={{
        width: "250px",
        padding: "10px",
        borderRight: "1px solid #ccc",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h3>Educational Blogs</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {blogs.map((blog) => (
          <li key={blog.id} style={{ margin: "10px 0" }}>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#2196F3" }}
            >
              {blog.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSection;
