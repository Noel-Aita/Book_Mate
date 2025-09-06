// src/components/BlogSection.jsx
import React, { useEffect, useState } from "react";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Example: Using free educational blog API or RSS feed
        const res = await fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=5");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();

        // Map to our structure
        const formatted = data.map((item) => ({
          title: item.title,
          url: item.url,
          image: item.imageUrl || "",
          summary: item.summary,
        }));

        setBlogs(formatted);
      } catch (err) {
        console.error("Failed to fetch blogs, using fallback:", err);

        // Fallback blogs if API fails
        setBlogs([
          {
            title: "Fallback Blog 1",
            url: "#",
            image: "",
            summary: "This is a fallback blog summary.",
          },
          {
            title: "Fallback Blog 2",
            url: "#",
            image: "",
            summary: "This is another fallback blog summary.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Educational Blogs</h3>
      <ul>
        {blogs.map((blog, idx) => (
          <li key={idx} style={{ marginBottom: 15 }}>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#2196F3" }}
            >
              <strong>{blog.title}</strong>
            </a>
            <p>{blog.summary.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSection;
