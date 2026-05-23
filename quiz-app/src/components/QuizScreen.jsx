// src/components/QuizScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml";
import { buildExplanation } from "../utils/explanations";
import { updateStats, addBookmark, getStats } from "../utils/playerStats";
import { playCorrect, playWrong, playTick, playFanfare, playStreak } from "../utils/sounds";
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
  const [streak,       setStreak]       = useState(0);
  const [bestStreak,   setBestStreak]   = useState(0);
  const [answerAnim,   setAnswerAnim]   = useState(null);
  const [bookmarked,   setBookmarked]   = useState(false);
  const [lifelines,    setLifelines]    = useState({ fiftyFifty: true, skip: true, audience: true });
  const [hiddenAnswers,  setHiddenAnswers]  = useState([]);
  const [audienceData,   setAudienceData]   = useState(null);
  const [lifelineFlash,  setLifelineFlash]  = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const shuffle  = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      const amount = Math.floor(Math.random() * 8) + 8;
      const cat = category || "9"; const diff = difficulty || "easy";
      try {
        const res  = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${cat}&difficulty=${diff}&type=multiple`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.response_code !== 0 || !data.results?.length) throw new Error();
        setQuestions(shuffle(data.results).map((q) => ({ ...q, all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]), explanation: buildExplanation(q) })));
      } catch {
        const pool = localQuestions.filter((q) => !category || String(q.category_id) === String(category));
        setQuestions(shuffle(pool.length ? pool : localQuestions).map((q) => ({ ...q, all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]), explanation: buildExplanation(q) })));
        setError("Using offline questions — connect to the internet for more variety.");
      } finally { setLoading(false); }
    };
    load();
  }, [category, difficulty]);

  useEffect(() => {
    if (loading || revealed) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 10) playTick();
        if (t <= 1) { clearInterval(timerRef.current); setRevealed(true); setStreak(0); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading]); // eslint-disable-line

  useEffect(() => { if (revealed) clearInterval(timerRef.current); }, [revealed]);
  useEffect(() => { setHiddenAnswers([]); setAudienceData(null); setBookmarked(false); setAnswerAnim(null); }, [currentIndex]);

  const flash = (msg) => { setLifelineFlash(msg); setTimeout(() => setLifelineFlash(null), 2500); };

  const handleAnswer = (answer) => {
    if (revealed || hiddenAnswers.includes(answer)) return;
    clearInterval(timerRef.current);
    setSelected(answer); setRevealed(true);
    const correct = answer === questions[currentIndex].correct_answer;
    if (correct) {
      const ns = streak + 1; setStreak(ns); setBestStreak((b) => Math.max(b, ns)); setScore((s) => s + 1);
      setAnswerAnim("correct"); playCorrect();
      if (ns === 3 || ns === 5) playStreak();
    } else { setStreak(0); setAnswerAnim("wrong"); playWrong(); }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || revealed) return;
    const q = questions[currentIndex];
    const toHide = shuffle(q.all_answers.filter((a) => a !== q.correct_answer)).slice(0, 2);
    setHiddenAnswers(toHide); setLifelines((l) => ({ ...l, fiftyFifty: false }));
    flash("50/50 used — two wrong answers removed!");
  };

  const useSkip = () => {
    if (!lifelines.skip || revealed) return;
    setLifelines((l) => ({ ...l, skip: false })); flash("Question skipped!");
    setSelected(null); setRevealed(false); setAnswerAnim(null);
    setCurrentIndex((i) => i + 1);
  };

  const useAudience = () => {
    if (!lifelines.audience || revealed) return;
    const q = questions[currentIndex];
    const correctPct = Math.floor(Math.random() * 30) + 40;
    const others = q.all_answers.filter((a) => a !== q.correct_answer);
    let left = 100 - correctPct;
    const data = { [q.correct_answer]: correctPct };
    others.forEach((a, i) => {
      const p = i === others.length - 1 ? left : Math.floor(Math.random() * (left / (others.length - i)));
      data[a] = p; left -= p;
    });
    setAudienceData(data); setLifelines((l) => ({ ...l, audience: false })); flash("Audience has voted!");
  };

  const handleBookmark = () => { addBookmark({ ...questions[currentIndex], bookmarkedAt: new Date().toISOString() }); setBookmarked(true); };

  const goNext = () => { setSelected(null); setRevealed(false); setAnswerAnim(null); setCurrentIndex((i) => i + 1); };

  const submitQuiz = () => {
    const stats = getStats();
    const { newBadges, xpEarned } = updateStats({ score, total: questions.length, category: questions[0]?.category || "", streak: bestStreak, timeBonus: 0, prevScore: stats.history[0]?.pct / 100 || 0 });
    playFanfare();
    navigate("/results", { state: { score, totalQuestions: questions.length, playerName, xpEarned, newBadges } });
  };

  if (loading) return (
    <div className={styles.container}><div className={styles.quizCard}><div className={styles.loadingWrap}><div className={styles.spinner} /><p className={styles.loadingText}>Loading questions…</p></div></div></div>
  );

  const q = questions[currentIndex];
  const progress   = ((currentIndex + 1) / questions.length) * 100;
  const isLast     = currentIndex === questions.length - 1;
  const timerPct   = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? "#10b981" : timeLeft > 8 ? "#f59e0b" : "#ef4444";
  const timedOut   = revealed && selected === null;

  const getAnswerClass = (ans) => {
    if (hiddenAnswers.includes(ans)) return `${styles.answerButton} ${styles.hiddenAnswer}`;
    if (!revealed) return styles.answerButton;
    if (ans === q.correct_answer) return `${styles.answerButton} ${styles.correctAnswer}`;
    if (ans === selected && ans !== q.correct_answer) return `${styles.answerButton} ${styles.wrongAnswer}`;
    return `${styles.answerButton} ${styles.dimmedAnswer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.quizCard}>
        {error && <p className={styles.offlineNote}>{error}</p>}

        <div className={styles.topBar}>
          <span className={styles.playerTag}>👤 {playerName || "Player"}</span>
          {streak >= 2 && <span className={styles.streakBadge}>🔥 {streak}{streak >= 5 ? " ⚡" : ""}</span>}
          <span className={styles.scoreLive}>⭐ {score} / {questions.length}</span>
        </div>

        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

        <div className={styles.header}>
          <span className={styles.questionCount}>Question {currentIndex + 1} of {questions.length}</span>
          <div className={styles.timerWrap}>
            <svg className={styles.timerRing} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={timerColor} strokeWidth="3"
                strokeDasharray={`${timerPct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }} />
            </svg>
            <span className={styles.timerNum} style={{ color: timerColor }}>{timeLeft}</span>
          </div>
          <span className={styles.diffBadge}>{(difficulty || "easy").toUpperCase()}</span>
        </div>

        {!revealed && (
          <div className={styles.lifelines}>
            <button className={`${styles.lifeline} ${!lifelines.fiftyFifty ? styles.lifelineUsed : ""}`} onClick={useFiftyFifty} disabled={!lifelines.fiftyFifty} title="Remove two wrong answers">50/50</button>
            <button className={`${styles.lifeline} ${!lifelines.skip ? styles.lifelineUsed : ""}`} onClick={useSkip} disabled={!lifelines.skip} title="Skip this question">⏭ Skip</button>
            <button className={`${styles.lifeline} ${!lifelines.audience ? styles.lifelineUsed : ""}`} onClick={useAudience} disabled={!lifelines.audience} title="Ask the audience">👥 Poll</button>
          </div>
        )}

        {lifelineFlash && <p className={styles.lifelineFlash}>{lifelineFlash}</p>}

        {audienceData && (
          <div className={styles.audiencePoll}>
            <p className={styles.audienceTitle}>👥 Audience Vote</p>
            {q.all_answers.map((ans) => (
              <div key={ans} className={styles.audienceRow}>
                <span className={styles.audienceLabel} dangerouslySetInnerHTML={{ __html: decodeHtml(ans) }} />
                <div className={styles.audienceBarWrap}><div className={styles.audienceBar} style={{ width: `${audienceData[ans] || 0}%` }} /></div>
                <span className={styles.audiencePct}>{audienceData[ans] || 0}%</span>
              </div>
            ))}
          </div>
        )}

        {timedOut && <p className={styles.timedOutNote}>⏰ Time's up! The correct answer is shown below.</p>}

        <p className={styles.question} dangerouslySetInnerHTML={{ __html: decodeHtml(q.question) }} />

        <div className={`${styles.answerGrid} ${answerAnim === "correct" ? styles.gridCorrect : answerAnim === "wrong" ? styles.gridWrong : ""}`}>
          {q.all_answers.map((ans, idx) => (
            <button key={idx} type="button" disabled={revealed || hiddenAnswers.includes(ans)} onClick={() => handleAnswer(ans)} className={getAnswerClass(ans)}>
              <span className={styles.answerLetter}>{["A","B","C","D"][idx]}</span>
              <span dangerouslySetInnerHTML={{ __html: decodeHtml(ans) }} />
              {revealed && ans === q.correct_answer && <span className={styles.tick}>✓</span>}
              {revealed && ans === selected && ans !== q.correct_answer && <span className={styles.cross}>✗</span>}
            </button>
          ))}
        </div>

        {revealed && (
          <div className={timedOut || selected !== q.correct_answer ? `${styles.explanation} ${styles.explanationWrong}` : `${styles.explanation} ${styles.explanationCorrect}`}>
            <div className={styles.explanationHeader}>
              <p className={styles.explanationTitle}>{timedOut ? "⏰ Time's up!" : selected === q.correct_answer ? "✅ Correct!" : "❌ Not quite!"}</p>
              <button className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarkActive : ""}`} onClick={handleBookmark}>{bookmarked ? "🔖 Saved" : "🔖 Save"}</button>
            </div>
            <p className={styles.explanationText}>{q.explanation}</p>
          </div>
        )}

        <div className={styles.navigation}>
          <button type="button" className={styles.navBtn} onClick={() => navigate("/category")}>✕ Exit</button>
          {revealed && (isLast
            ? <button type="button" className={styles.submitButton} onClick={submitQuiz}>See Results →</button>
            : <button type="button" className={styles.nextBtn} onClick={goNext}>Next Question →</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
