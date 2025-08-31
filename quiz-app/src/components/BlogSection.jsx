// src/components/BlogSection.jsx
import React from "react";
import "./BlogSection.css"; // styling for blogs

function BlogSection() {
  // Placeholder blog data → you can replace with real API later
  const blogs = [
    { id: 1, title: "Boost Your Brainpower", img: "/assets/blog1.png", text: "Daily quizzes help improve memory and focus." },
    { id: 2, title: "Fun Facts Corner", img: "/assets/blog2.png", text: "Did you know? Honey never spoils!" },
    { id: 3, title: "Word of the Day", img: "/assets/blog3.png", text: "‘Serendipity’: the occurrence of events by chance in a happy way." },
  ];

  return (
    <div className="blog-section">
      <h3>📚 Learning Hub</h3>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <img src={blog.img} alt={blog.title} className="blog-image" />
            <h4>{blog.title}</h4>
            <p>{blog.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogSection;
