// src/components/MultiplayerQuizScreen.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml";
import { buildExplanation } from "../utils/explanations";
import localQuestions from "../data/localQuestions";
import styles from "./MultiplayerQuizScreen.module.css";

const TIMER_SECONDS = 30;
const CPU_DELAY     = 1800;

const MultiplayerQuizScreen = () => {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const { players: initialPlayers, category, difficulty } = state || {};

  const [questions,   setQuestions]   = useState([]);
  const [qIndex,      setQIndex]      = useState(0);
  const [askerIndex,  setAskerIndex]  = useState(0);
  const [players,     setPlayers]     = useState(initialPlayers || []);
  const [loading,     setLoading]     = useState(true);

  const [phase,       setPhase]       = useState("asking");
  const [stealQueue,  setStealQueue]  = useState([]);
  const [stealerIdx,  setStealer]     = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [wrongBy,     setWrongBy]     = useState([]);
  const [cpuThinking, setCpuThinking] = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECONDS);

  const timerRef    = useRef(null);
  const cpuTimerRef = useRef(null);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // ── Fetch questions ──
  useEffect(() => {
    const load = async () => {
      const amount = 10 + Math.floor(Math.random() * 5);
      const cat    = category   || "9";
      const diff   = difficulty || "easy";
      try {
        const res  = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${cat}&difficulty=${diff}&type=multiple`);
        const data = await res.json();
        if (data.response_code !== 0 || !data.results?.length) throw new Error();
        setQuestions(shuffle(data.results).map((q) => ({
          ...q,
          all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
          explanation: buildExplanation(q),
        })));
      } catch {
        setQuestions(shuffle(localQuestions).map((q) => ({
          ...q,
          all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
          explanation: buildExplanation(q),
        })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, difficulty]);

  const q            = questions[qIndex];
  const currentActor = phase === "stealing" ? players[stealerIdx] : players[askerIndex];
  const isCPUTurn    = currentActor?.type === "cpu" && phase !== "done";

  // ── Timer — resets each time the active player changes ──
  useEffect(() => {
    if (loading || phase === "done" || isCPUTurn) return;
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [qIndex, phase, stealerIdx, askerIndex, loading]); // eslint-disable-line

  // Stop timer when answered or done
  useEffect(() => {
    if (phase === "done" || selected !== null) clearInterval(timerRef.current);
  }, [phase, selected]);

  // ── Timeout handler — treat as wrong answer ──
  const handleTimeout = useCallback(() => {
    if (phase === "done") return;
    handleAnswer("__timeout__");
  }, [phase, stealerIdx, askerIndex, stealQueue, wrongBy, players]); // eslint-disable-line

  // ── CPU auto-answer ──
  const doCpuAnswer = useCallback(() => {
    if (!q || phase === "done") return;
    const correct  = q.correct_answer;
    const wrong    = q.all_answers.filter((a) => a !== correct);
    const accuracy = phase === "asking" ? 0.70 : 0.55;
    const answer   = Math.random() < accuracy ? correct : wrong[Math.floor(Math.random() * wrong.length)];
    handleAnswer(answer);
  }, [q, phase, stealerIdx, askerIndex]); // eslint-disable-line

  useEffect(() => {
    if (!loading && isCPUTurn && phase !== "done") {
      setCpuThinking(true);
      cpuTimerRef.current = setTimeout(() => {
        setCpuThinking(false);
        doCpuAnswer();
      }, CPU_DELAY);
    }
    return () => clearTimeout(cpuTimerRef.current);
  }, [qIndex, phase, stealerIdx, askerIndex, loading]); // eslint-disable-line

  // ── Core answer handler ──
  const handleAnswer = (answer) => {
    if (phase === "done") return;
    clearInterval(timerRef.current);

    const isTimeout  = answer === "__timeout__";
    const correct    = !isTimeout && answer === q.correct_answer;
    const actorIndex = phase === "stealing" ? stealerIdx : askerIndex;

    if (!isTimeout) setSelected(answer);

    if (correct) {
      setPlayers((prev) =>
        prev.map((p, i) => i === actorIndex ? { ...p, score: p.score + 1 } : p)
      );
      setPhase("done");
    } else {
      const newWrong = [...wrongBy, actorIndex];
      setWrongBy(newWrong);

      if (phase === "asking") {
        const queue = players.map((_, i) => i).filter((i) => i !== askerIndex);
        if (queue.length === 0) {
          setPhase("done");
        } else {
          setStealQueue(queue);
          setStealer(queue[0]);
          setPhase("stealing");
          setSelected(null);
        }
      } else {
        const currentPos = stealQueue.indexOf(stealerIdx);
        const nextPos    = currentPos + 1;
        if (nextPos < stealQueue.length) {
          setStealer(stealQueue[nextPos]);
          setSelected(null);
        } else {
          setPhase("done");
        }
      }
    }
  };

  // ── Next question ──
  const goNext = () => {
    const nextQ     = qIndex + 1;
    const nextAsker = (askerIndex + 1) % players.length;
    if (nextQ >= questions.length) {
      navigate("/multi-results", { state: { players, totalQuestions: questions.length } });
      return;
    }
    setQIndex(nextQ);
    setAskerIndex(nextAsker);
    setPhase("asking");
    setStealQueue([]);
    setStealer(null);
    setSelected(null);
    setWrongBy([]);
  };

  if (loading || !q) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading questions…</p>
          </div>
        </div>
      </div>
    );
  }

  const progress    = ((qIndex + 1) / questions.length) * 100;
  const isLast      = qIndex === questions.length - 1;
  const timerPct    = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor  = timeLeft > 15 ? "#10b981" : timeLeft > 8 ? "#f59e0b" : "#ef4444";
  const showTimer   = phase !== "done" && !isCPUTurn;

  const getAnswerClass = (ans) => {
    if (phase !== "done" && selected === null) return styles.answerBtn;
    if (phase === "stealing" && selected !== null && ans !== q.correct_answer && ans !== selected)
      return `${styles.answerBtn} ${styles.dimmed}`;
    if (phase === "done" || selected !== null) {
      if (ans === q.correct_answer)                     return `${styles.answerBtn} ${styles.correct}`;
      if (ans === selected && ans !== q.correct_answer) return `${styles.answerBtn} ${styles.wrong}`;
      return `${styles.answerBtn} ${styles.dimmed}`;
    }
    return styles.answerBtn;
  };

  const isAnswerDisabled = phase === "done" || selected !== null || cpuThinking || isCPUTurn;

  const phaseLabel = () => {
    if (phase === "done")     return null;
    if (phase === "stealing") return `🔥 Steal chance — ${currentActor?.name}!`;
    return `${currentActor?.name}'s turn`;
  };

  // Determine who scored (if anyone)
  const scorerIndex = players.findIndex((_, i) => !wrongBy.includes(i));
  const nobodyScored = wrongBy.length >= players.length;

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* Scoreboard */}
        <div className={styles.scoreboard}>
          {players.map((p, i) => {
            const isActive = (phase === "asking" && i === askerIndex) ||
                             (phase === "stealing" && i === stealerIdx);
            const hasWrong = wrongBy.includes(i);
            return (
              <div
                key={i}
                className={`${styles.playerChip} ${isActive ? styles.activeChip : ""} ${hasWrong ? styles.wrongChip : ""}`}
                style={{ "--pcolor": p.color }}
              >
                <span className={styles.chipAvatar}>{p.avatar}</span>
                <span className={styles.chipName}>{p.name}</span>
                <span className={styles.chipScore}>{p.score}</span>
                {hasWrong && <span className={styles.chipX}>✗</span>}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        {/* Turn banner + timer */}
        <div className={styles.bannerRow}>
          <div
            className={`${styles.turnBanner} ${phase === "stealing" ? styles.stealBanner : ""}`}
            style={{ "--pcolor": currentActor?.color }}
          >
            <span className={styles.turnAvatar}>{currentActor?.avatar}</span>
            <span className={styles.turnText}>
              {cpuThinking ? `${currentActor?.name} is thinking…` : phaseLabel()}
            </span>
            <span className={styles.qCount}>Q {qIndex + 1}/{questions.length}</span>
          </div>

          {/* Visible countdown ring */}
          {showTimer && (
            <div className={styles.timerWrap}>
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
          )}
        </div>

        {/* Steal note */}
        {phase === "stealing" && (
          <p className={styles.stealNote}>
            ❌ <strong>{players[askerIndex]?.name}</strong> got it wrong — others can steal the point!
          </p>
        )}

        {/* Question */}
        <p className={styles.question} dangerouslySetInnerHTML={{ __html: decodeHtml(q.question) }} />

        {/* Answers */}
        <div className={styles.answerGrid}>
          {q.all_answers.map((ans, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnswerDisabled}
              onClick={() => handleAnswer(ans)}
              className={getAnswerClass(ans)}
            >
              <span className={styles.answerLetter}>{["A","B","C","D"][idx]}</span>
              <span dangerouslySetInnerHTML={{ __html: decodeHtml(ans) }} />
              {(phase === "done" || selected !== null) && ans === q.correct_answer && <span className={styles.tick}>✓</span>}
              {selected === ans && ans !== q.correct_answer && <span className={styles.cross}>✗</span>}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {phase === "done" && (
          <div className={nobodyScored ? `${styles.explanation} ${styles.expWrong}` : `${styles.explanation} ${styles.expCorrect}`}>
            <p className={styles.expTitle}>
              {nobodyScored
                ? "😬 Nobody got it right!"
                : scorerIndex === askerIndex
                  ? `✅ Correct — ${players[askerIndex]?.name}!`
                  : `🔥 Stolen by ${players[scorerIndex]?.name}!`}
            </p>
            <p className={styles.expText}>{q.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.nav}>
          <button className={styles.exitBtn} onClick={() => navigate("/setup")}>✕ Exit</button>
          {phase === "done" && (
            <button className={styles.nextBtn} onClick={goNext}>
              {isLast ? "See Results →" : `Next → (${players[(askerIndex + 1) % players.length]?.name}'s turn)`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MultiplayerQuizScreen;
