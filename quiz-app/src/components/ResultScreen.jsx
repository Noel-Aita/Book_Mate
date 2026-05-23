// src/components/ResultScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStats, getRank, getNextRank, removeBookmark, BADGES } from "../utils/playerStats";
import styles from "./ResultScreen.module.css";

const ResultScreen = ({ playerName: nameProp }) => {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const score          = state?.score          ?? 0;
  const totalQuestions = state?.totalQuestions ?? 0;
  const playerName     = state?.playerName     ?? nameProp ?? "Player";
  const xpEarned       = state?.xpEarned       ?? 0;
  const newBadges      = state?.newBadges       ?? [];
  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const [tab,       setTab]       = useState("result"); // "result"|"badges"|"bookmarks"
  const [stats,     setStats]     = useState(getStats());
  const rank     = getRank(stats.xp);
  const nextRank = getNextRank(stats.xp);
  const xpToNext = nextRank ? nextRank.minXP - stats.xp : 0;
  const xpPct    = nextRank ? Math.round(((stats.xp - getRank(stats.xp - xpEarned)?.minXP || 0) / (nextRank.minXP - (rank.minXP))) * 100) : 100;

  const getMessage = () => {
    if (pct === 100) return "Perfect score! You're unstoppable! 🔥";
    if (pct >= 80)   return "Great job! You really know your stuff.";
    if (pct >= 60)   return "Not bad! A bit more practice and you'll ace it.";
    if (pct >= 40)   return "Keep going — every quiz makes you sharper.";
    return "Tough round! Give it another shot.";
  };

  const handleRemoveBookmark = (questionText) => {
    removeBookmark(questionText);
    setStats(getStats());
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* Tab bar */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === "result"    ? styles.tabActive : ""}`} onClick={() => setTab("result")}>Results</button>
          <button className={`${styles.tab} ${tab === "badges"    ? styles.tabActive : ""}`} onClick={() => setTab("badges")}>
            Badges {newBadges.length > 0 && <span className={styles.newDot}>{newBadges.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === "bookmarks" ? styles.tabActive : ""}`} onClick={() => setTab("bookmarks")}>
            Saved {stats.bookmarks.length > 0 && <span className={styles.newDot}>{stats.bookmarks.length}</span>}
          </button>
        </div>

        {/* ── Results tab ── */}
        {tab === "result" && (
          <>
            <div className={styles.trophy}>{pct === 100 ? "🏆" : pct >= 60 ? "🎯" : "📚"}</div>
            <h2 className={styles.title}>Quiz Complete!</h2>
            <p className={styles.playerName}>Well done, {playerName}!</p>

            <div className={styles.scoreRing} style={{ "--pct": `${pct}%` }}>
              <div className={styles.scoreText}>
                <span className={styles.scoreNumber}>{score}/{totalQuestions}</span>
                <span className={styles.scoreLabel}>{pct}%</span>
              </div>
            </div>

            <p className={styles.message}>{getMessage()}</p>

            {/* XP earned */}
            {xpEarned > 0 && (
              <div className={styles.xpEarned}>
                <span>+{xpEarned} XP earned</span>
              </div>
            )}

            {/* Rank + XP bar */}
            <div className={styles.rankRow}>
              <span className={styles.rankIcon}>{rank.icon}</span>
              <div className={styles.rankInfo}>
                <div className={styles.rankName} style={{ color: rank.color }}>{rank.name}</div>
                <div className={styles.xpBarWrap}>
                  <div className={styles.xpBar} style={{ width: `${Math.min(xpPct, 100)}%`, background: rank.color }} />
                </div>
                <div className={styles.xpLabel}>
                  {stats.xp} XP {nextRank ? `· ${xpToNext} to ${nextRank.name}` : "· Max rank!"}
                </div>
              </div>
            </div>

            {/* New badges toast */}
            {newBadges.length > 0 && (
              <div className={styles.newBadgesRow}>
                {newBadges.map((b) => b && (
                  <div key={b.id} className={styles.newBadge}>
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.retrybutton} onClick={() => navigate("/category")}>🔄 Play Again</button>
              <button className={styles.button}      onClick={() => navigate("/")}>← Home</button>
            </div>
          </>
        )}

        {/* ── Badges tab ── */}
        {tab === "badges" && (
          <div className={styles.badgeGrid}>
            {BADGES.map((b) => {
              const earned = stats.badges.includes(b.id);
              const isNew  = newBadges.some((nb) => nb?.id === b.id);
              return (
                <div key={b.id} className={`${styles.badgeCard} ${earned ? styles.badgeEarned : styles.badgeLocked} ${isNew ? styles.badgeNew : ""}`}>
                  <span className={styles.badgeIcon}>{earned ? b.icon : "🔒"}</span>
                  <span className={styles.badgeLabel}>{b.label}</span>
                  <span className={styles.badgeDesc}>{b.desc}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bookmarks tab ── */}
        {tab === "bookmarks" && (
          <div className={styles.bookmarkList}>
            {stats.bookmarks.length === 0 ? (
              <p className={styles.emptyMsg}>No saved questions yet. Hit 🔖 during a quiz to save tricky ones!</p>
            ) : (
              stats.bookmarks.map((q, i) => (
                <div key={i} className={styles.bookmarkCard}>
                  <p className={styles.bookmarkQ} dangerouslySetInnerHTML={{ __html: q.question }} />
                  <p className={styles.bookmarkA}>✓ {q.correct_answer}</p>
                  <button className={styles.removeBtn} onClick={() => handleRemoveBookmark(q.question)}>Remove</button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultScreen;
