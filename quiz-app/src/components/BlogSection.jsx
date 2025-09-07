import { useState, useEffect } from 'react';
import styles from'../styles/BlogSection.module.css';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // In a real app, this would be an API call to your blog service
      const mockBlogs = [
        {
          id: 1,
          title: "10 Tips to Improve Your General Knowledge",
          excerpt: "Discover simple ways to expand your knowledge every day",
          url: "#",
          image: "https://placehold.co/300x200/4F46E5/FFFFFF?text=Knowledge+Tips"
        },
        {
          id: 2,
          title: "The Science Behind Learning and Memory",
          excerpt: "How our brains process and retain information effectively",
          url: "#",
          image: "https://placehold.co/300x200/10B981/FFFFFF?text=Science+Learning"
        },
        {
          id: 3,
          title: "History Facts You Probably Didn't Know",
          excerpt: "Fascinating historical events that shaped our world",
          url: "#",
          image: "https://placehold.co/300x200/F59E0B/FFFFFF?text=History+Facts"
        }
      ];
      
      setBlogs(mockBlogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-section">Loading educational content...</div>;
  }

  return (
    <div className="blog-section">
      <h3>Educational Content</h3>
      <div className="blog-grid">
        {blogs.map(blog => (
          <a key={blog.id} href={blog.url} className="blog-card" target="_blank" rel="noopener noreferrer">
            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
            </div>
            <div className="blog-content">
              <h4>{blog.title}</h4>
              <p>{blog.excerpt}</p>
              <span className="read-more">Read more →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;