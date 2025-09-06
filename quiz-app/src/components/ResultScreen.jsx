// src/components/ResultsScreen.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import BlogSection from "./BlogSection";
import styles from "../styles/ResultScreen.module.css";

const ResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { scores, players, username } = location.state || {};

  // Redirect if no results data
  if (!scores || !players) {
    navigate("/home");
    return null;
  }

  return (
    <Layout>
      <div
        className={styles.resultsContainer}
        style={{
          backgroundImage: "url(/assets/results-bg.jpg)",
          backgroundSize: "cover",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h1>Quiz Results</h1>

        {players.length > 1 ? (
          <div className={styles.multiplayerResults}>
            <h2>Multiplayer Scores</h2>
            <ul>
              {players.map((player) => (
                <li key={player.username}>
                  {player.username}: {scores[player.username] || 0} points
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.singlePlayerResults}>
            <h2>{username} scored {scores[username] || 0} points</h2>
          </div>
        )}

        <div className={styles.resultButtons}>
          <button
            className={styles.homeButton}
            onClick={() => navigate("/home")}
          >
            Home
          </button>
          <button
            className={styles.retryButton}
            onClick={() =>
              players.length > 1
                ? navigate("/mode", { state: { username } })
                : navigate("/category-difficulty", { state: { username } })
            }
          >
            Retry
          </button>
        </div>

        {/* Show blog only if not multiplayer? Currently showing for all pages */}
        <BlogSection />
      </div>
    </Layout>
  );
};

export default ResultsScreen;
