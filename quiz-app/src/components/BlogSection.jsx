import React, { useEffect, useState } from "react";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://api.sampleapis.com/futurama/episodes");
        const data = await res.json();
        setBlogs(data.slice(0, 5));
      } catch {
        setBlogs([{ title: "Sample Blog", link: "#" }]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h3>Educational Blogs</h3>
      <ul>
        {blogs.map((blog, idx) => (
          <li key={idx}>
            <a href={blog.link || "#"} target="_blank" rel="noreferrer">
              {blog.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSection;
