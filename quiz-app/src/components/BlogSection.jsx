import React, { useEffect, useState } from "react";
import styles from "../styles/BlogSection.module.css"; // Make sure this path is correct

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
    <div className={styles.blogContainer}>
      <h3 className={styles.blogHeading}>Educational Blogs</h3>
      <ul className={styles.blogList}>
        {blogs.map((blog, idx) => (
          <li key={idx} className={styles.blogItem}>
            <a
              href={blog.link || "#"}
              target="_blank"
              rel="noreferrer"
              className={styles.blogLink}
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
