// src/components/TimedChallenge.jsx — 60 second blitz mode
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml";
import { buildExplanation } from "../utils/explanations";
import { updateStats } from "../utils/playerStats";
import { playCorrect, playWrong, playTick, playFanfare } from "../utils/sounds";
import localQuestions from "../data/localQuestions";
import styles from "./TimedChallenge.module.css";

const GAME_TIME = 60;

const TimedChallenge = ({ category, difficulty, playerName }) => {
  const [questions,    setQuestions]    = useState([]);
  const [qIndex,       setQIndex]       = useState(0);
  const [score,        setScore]        = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(GAME_TIME);
  const [loading,      setLoading]      = useState(true);
  const [gameOver,     setGameOver]     = useState(false);
  const [lastResult,   setLastResult]   = useState(null); // "correct"|"wrong"
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const shuffle  = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const load = async () => {
      const cat = category || "9"; const diff = difficulty || "easy";
      try {
        const res  = await fetch(`https://opentdb.com/api.php?amount=50&category=${cat}&difficulty=${diff}&type=multiple`);
        const data = await res.json();
        if (data.response_code !== 0 || !data.results?.length) throw new Error();
        setQuestions(shuffle(data.results).map((q) => ({ ...q, all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]) })));
      } catch {
        setQuestions(shuffle(localQuestions).map((q) => ({ ...q, all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]) })));
      } finally { setLoading(false); }
    };
    load();
  }, [category, difficulty]);

  // Start countdown once loaded
  useEffect(() => {
    if (loading) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 10) playTick();
        if (t <= 1) { clearInterval(timerRef.current); endGame(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading]); // eslint-disable-line

  const endGame = () => {
    setGameOver(true);
    playFanfare();
    updateStats({ score, total: qIndex || 1, category: "", streak: 0, timeBonus: score * 2 });
  };

  const handleAnswer = (ans) => {
    if (gameOver) return;
    const correct = ans === questions[qIndex]?.correct_answer;
    if (correct) { setScore((s) => s + 1); setLastResult("correct"); playCorrect(); }
    else         { setLastResult("wrong"); playWrong(); }
    setTimeout(() => setLastResult(null), 300);
    setQIndex((i) => i + 1);
  };

  if (loading) return (
    <div className={styles.container}><div className={styles.card}><div className={styles.loadingWrap}><div className={styles.spinner}/><p className={styles.loadingText}>Loading…</p></div></div></div>
  );

  if (gameOver || qIndex >= questions.length) {
    const pct = qIndex > 0 ? Math.round((score / qIndex) * 100) : 0;
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.trophy}>{score >= 15 ? "🏆" : score >= 8 ? "🎯" : "📚"}</div>
          <h2 className={styles.title}>Time's Up!</h2>
          <p className={styles.playerName}>Well done, {playerName || "Player"}!</p>
          <div className={styles.scoreRing} style={{ "--pct": `${Math.min(pct, 100)}%` }}>
            <div className={styles.scoreText}>
              <span className={styles.scoreNumber}>{score}</span>
              <span className={styles.scoreLabel}>correct</span>
            </div>
          </div>
          <p className={styles.statLine}>Answered {qIndex} questions · {pct}% accuracy</p>
          <div className={styles.actions}>
            <button className={styles.retryBtn} onClick={() => navigate("/category")}>🔄 Play Again</button>
            <button className={styles.homeBtn}  onClick={() => navigate("/")}>← Home</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const timerColor = timeLeft > 30 ? "#10b981" : timeLeft > 15 ? "#f59e0b" : "#ef4444";
  const timerPct   = (timeLeft / GAME_TIME) * 100;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${lastResult === "correct" ? styles.flashCorrect : lastResult === "wrong" ? styles.flashWrong : ""}`}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.scorePill}>⭐ {score}</span>
          <div className={styles.timerWrap}>
            <svg className={styles.timerRing} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={timerColor} strokeWidth="3"
                strokeDasharray={`${timerPct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}/>
            </svg>
            <span className={styles.timerNum} style={{ color: timerColor }}>{timeLeft}</span>
          </div>
          <span className={styles.qPill}>Q {qIndex + 1}</span>
        </div>

        <p className={styles.question} dangerouslySetInnerHTML={{ __html: decodeHtml(q.question) }} />

        <div className={styles.answerGrid}>
          {q.all_answers.map((ans, i) => (
            <button key={i} type="button" className={styles.answerBtn} onClick={() => handleAnswer(ans)}>
              <span className={styles.answerLetter}>{["A","B","C","D"][i]}</span>
              <span dangerouslySetInnerHTML={{ __html: decodeHtml(ans) }} />
            </button>
          ))}
        </div>

        <button className={styles.exitBtn} onClick={() => { clearInterval(timerRef.current); endGame(); }}>End Game</button>
      </div>
    </div>
  );
};

export default TimedChallenge;
