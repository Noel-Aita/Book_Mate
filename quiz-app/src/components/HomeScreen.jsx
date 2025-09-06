import React from "react";
import { useNavigate } from "react-router-dom";
import BlogSection from "./BlogSection";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Book Mate Quiz</h1>
      <button onClick={() => navigate("/login")}>Login / Signup</button>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default HomeScreen;
