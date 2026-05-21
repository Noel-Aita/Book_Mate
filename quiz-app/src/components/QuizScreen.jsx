// src/components/QuizScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml";
import { buildExplanation } from "../utils/explanations";
import localQuestions from "../data/localQuestions";
import styles from "./QuizScreen.module.css";

const TIMER_SECONDS = 30;

const QuizScreen = ({ category, difficulty, playerName }) => {
  const [questions,    setQuestions]    = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score,        setScore]        = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [revealed,     setRevealed]     = useState(false);
  const [timeLeft,     setTimeLeft]     = useState(TIMER_SECONDS);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // ── Fetch questions ──
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      const amount = Math.floor(Math.random() * 8) + 8;
      const cat    = category   || "9";
      const diff   = difficulty || "easy";
      try {
        const res  = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${cat}&difficulty=${diff}&type=multiple`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.response_code !== 0 || !data.results?.length) throw new Error();
        setQuestions(shuffle(data.results).map((q) => ({
          ...q,
          all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
          explanation: buildExplanation(q),
        })));
      } catch {
        const filtered = localQuestions.filter(
          (q) => !category || String(q.category_id) === String(category)
        );
        const pool = filtered.length ? filtered : localQuestions;
        setQuestions(shuffle(pool).map((q) => ({
          ...q,
          all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
          explanation: buildExplanation(q),
        })));
        setError("Using offline questions — connect to the internet for more variety.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, difficulty]);

  // ── Timer ──
  useEffect(() => {
    if (loading || revealed) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time's up — auto-reveal with no answer selected
          setRevealed(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading]); // eslint-disable-line

  // Stop timer when answered
  useEffect(() => {
    if (revealed) clearInterval(timerRef.current);
  }, [revealed]);

  const handleAnswer = (answer) => {
    if (revealed) return;
    clearInterval(timerRef.current);
    setSelected(answer);
    setRevealed(true);
    if (answer === questions[currentIndex].correct_answer) setScore((s) => s + 1);
  };

  const goNext = () => {
    setSelected(null);
    setRevealed(false);
    setCurrentIndex((i) => i + 1);
  };

  const submitQuiz = () => {
    navigate("/results", { state: { score, totalQuestions: questions.length, playerName } });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.quizCard}>
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading questions…</p>
          </div>
        </div>
      </div>
    );
  }

  const q        = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast   = currentIndex === questions.length - 1;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? "#10b981" : timeLeft > 8 ? "#f59e0b" : "#ef4444";
  const timedOut  = revealed && selected === null;

  const getAnswerClass = (ans) => {
    if (!revealed) return styles.answerButton;
    if (ans === q.correct_answer)                     return `${styles.answerButton} ${styles.correctAnswer}`;
    if (ans === selected && ans !== q.correct_answer) return `${styles.answerButton} ${styles.wrongAnswer}`;
    return `${styles.answerButton} ${styles.dimmedAnswer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.quizCard}>
        {error && <p className={styles.offlineNote}>{error}</p>}

        {/* Top bar */}
        <div className={styles.topBar}>
          <span className={styles.playerTag}>👤 {playerName || "Player"}</span>
          <span className={styles.scoreLive}>⭐ {score} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        {/* Header + Timer */}
        <div className={styles.header}>
          <span className={styles.questionCount}>Question {currentIndex + 1} of {questions.length}</span>
          <div className={styles.timerWrap}>
            {/* SVG countdown ring */}
            <svg className={styles.timerRing} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={timerColor}
                strokeWidth="3"
                strokeDasharray={`${timerPct} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
              />
            </svg>
            <span className={styles.timerNum} style={{ color: timerColor }}>{timeLeft}</span>
          </div>
          <span className={styles.diffBadge}>{(difficulty || "easy").toUpperCase()}</span>
        </div>

        {/* Timed-out notice */}
        {timedOut && (
          <p className={styles.timedOutNote}>⏰ Time's up! The correct answer is shown below.</p>
        )}

        {/* Question */}
        <p className={styles.question} dangerouslySetInnerHTML={{ __html: decodeHtml(q.question) }} />

        {/* Answers */}
        <div className={styles.answerGrid}>
          {q.all_answers.map((ans, idx) => (
            <button
              key={idx}
              type="button"
              disabled={revealed}
              onClick={() => handleAnswer(ans)}
              className={getAnswerClass(ans)}
            >
              <span className={styles.answerLetter}>{["A","B","C","D"][idx]}</span>
              <span dangerouslySetInnerHTML={{ __html: decodeHtml(ans) }} />
              {revealed && ans === q.correct_answer && <span className={styles.tick}>✓</span>}
              {revealed && ans === selected && ans !== q.correct_answer && <span className={styles.cross}>✗</span>}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {revealed && (
          <div className={
            timedOut ? `${styles.explanation} ${styles.explanationWrong}`
            : selected === q.correct_answer ? `${styles.explanation} ${styles.explanationCorrect}`
            : `${styles.explanation} ${styles.explanationWrong}`
          }>
            <p className={styles.explanationTitle}>
              {timedOut ? "⏰ Time's up!" : selected === q.correct_answer ? "✅ Correct!" : "❌ Not quite!"}
            </p>
            <p className={styles.explanationText}>{q.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.navigation}>
          <button type="button" className={styles.navBtn} onClick={() => navigate("/category")}>✕ Exit</button>
          {revealed && (
            isLast
              ? <button type="button" className={styles.submitButton} onClick={submitQuiz}>See Results →</button>
              : <button type="button" className={styles.nextBtn} onClick={goNext}>Next Question →</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
