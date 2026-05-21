// src/components/HomeScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeScreen.module.css";

// Pool of real articles — rotates every 8 seconds, 3 shown at a time
const ARTICLES = [
  {
    img: "/images/science.jpg",
    category: "Science",
    text: "Why does the sky change color at sunset? Light scattering explained.",
    url: "https://www.scientificamerican.com/article/why-is-the-sky-blue/",
    read: "4 min read",
  },
  {
    img: "/images/tech-3.jpg",
    category: "Technology",
    text: "How large language models like GPT actually work under the hood.",
    url: "https://www.ibm.com/topics/large-language-models",
    read: "6 min read",
  },
  {
    img: "/images/art.jpg",
    category: "Arts & Culture",
    text: "The history of jazz and how it shaped modern music worldwide.",
    url: "https://www.britannica.com/art/jazz",
    read: "5 min read",
  },
  {
    img: "/images/learning.jpg",
    category: "History",
    text: "The Roman Empire: how it rose, ruled, and eventually fell.",
    url: "https://www.history.com/topics/ancient-rome/ancient-rome",
    read: "7 min read",
  },
  {
    img: "/images/pencils.jpg",
    category: "Education",
    text: "The science of memory: how to study smarter, not harder.",
    url: "https://www.apa.org/topics/memory",
    read: "5 min read",
  },
  {
    img: "/images/textbook.jpg",
    category: "Geography",
    text: "The world's most extreme environments and the life that thrives there.",
    url: "https://www.nationalgeographic.com/environment/",
    read: "4 min read",
  },
  {
    img: "/images/learning-is-fun.jpg",
    category: "Science",
    text: "Black holes: what they are, how they form, and why they matter.",
    url: "https://www.nasa.gov/audience/forstudents/k-4/stories/nasa-knows/what-is-a-black-hole-k4.html",
    read: "6 min read",
  },
  {
    img: "/images/group-discussion.jpg",
    category: "Society",
    text: "How critical thinking skills can change the way you see the world.",
    url: "https://www.criticalthinking.org/pages/defining-critical-thinking/766",
    read: "3 min read",
  },
  {
    img: "/images/nighttime-study.jpg",
    category: "Health",
    text: "Why sleep is the most powerful tool for learning and memory.",
    url: "https://www.sleepfoundation.org/how-sleep-works/memory-and-sleep",
    read: "5 min read",
  },
];

const VISIBLE = 3;
const INTERVAL = 8000; // rotate every 8 seconds

const HomeScreen = () => {
  const navigate = useNavigate();
  const [startIdx, setStartIdx] = useState(0);
  const [fading,   setFading]   = useState(false);

  // Auto-rotate articles
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setStartIdx((i) => (i + VISIBLE) % ARTICLES.length);
        setFading(false);
      }, 400);
    }, INTERVAL);
    return () => clearInterval(t);
  }, []);

  // Get current 3 articles (wraps around)
  const visible = Array.from({ length: VISIBLE }, (_, i) =>
    ARTICLES[(startIdx + i) % ARTICLES.length]
  );

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.content}>
        {/* ── Left: Hero ── */}
        <div className={styles.leftPane}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Live &amp; Interactive
          </span>

          <h1 className={styles.title}>
            Level up your<br />
            <span className={styles.titleAccent}>knowledge game</span>
          </h1>

          <p className={styles.message}>
            Challenge yourself with quizzes across science, tech, arts, and more.
            Compete solo or battle friends in real-time.
          </p>

          <div className={styles.actions}>
            <button className={styles.startButton} onClick={() => navigate("/login")}>
              Get Started →
            </button>
            <button className={styles.ghostButton} onClick={() => navigate("/login")}>
              Learn More
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Questions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>2</span>
              <span className={styles.statLabel}>Game Modes</span>
            </div>
          </div>
        </div>

        {/* ── Right: Rotating blog cards ── */}
        <div className={styles.rightPane}>
          <div className={styles.blogHeader}>
            <span className={styles.blogTitle}>Daily Reads</span>
            <div className={styles.blogDivider} />
            <span className={styles.blogDot} />
          </div>

          <div className={`${styles.blogList} ${fading ? styles.blogFade : ""}`}>
            {visible.map((article, i) => (
              <a
                key={`${startIdx}-${i}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.blogCard}
              >
                <img src={article.img} alt={article.category} className={styles.blogImage} />
                <div className={styles.blogContent}>
                  <span className={styles.blogCategory}>{article.category}</span>
                  <p className={styles.blogText}>{article.text}</p>
                  <span className={styles.blogMeta}>
                    {article.read} · <span className={styles.readLink}>Read article →</span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Dot indicators */}
          <div className={styles.dotRow}>
            {Array.from({ length: Math.ceil(ARTICLES.length / VISIBLE) }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dotBtn} ${Math.floor(startIdx / VISIBLE) === i ? styles.dotActive : ""}`}
                onClick={() => { setFading(true); setTimeout(() => { setStartIdx(i * VISIBLE); setFading(false); }, 400); }}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
