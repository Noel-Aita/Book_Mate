// src/components/MultiplayerSetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MultiplayerSetup.module.css";

const MAX_PLAYERS = 4;

// Available colors with emoji avatars
const COLOR_OPTIONS = [
  { color: "#ef4444", label: "Red",    avatar: "🔴", bg: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.55)"   },
  { color: "#3b82f6", label: "Blue",   avatar: "🔵", bg: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.55)"  },
  { color: "#10b981", label: "Green",  avatar: "🟢", bg: "rgba(16,185,129,0.18)",  border: "rgba(16,185,129,0.55)"  },
  { color: "#f59e0b", label: "Yellow", avatar: "🟡", bg: "rgba(245,158,11,0.18)",  border: "rgba(245,158,11,0.55)"  },
];

const makePlayer = (id) => ({
  id,
  name: "",
  type: "human",
  colorIndex: null, // index into COLOR_OPTIONS
});

const MultiplayerSetup = () => {
  const navigate = useNavigate();
  const [players,    setPlayers]    = useState([makePlayer(0)]);
  const [category,   setCategory]   = useState("9");
  const [difficulty, setDifficulty] = useState("easy");

  const categories = [
    { id: "9",  name: "General Knowledge" },
    { id: "21", name: "Sports" },
    { id: "23", name: "History" },
    { id: "17", name: "Science & Nature" },
    { id: "22", name: "Geography" },
  ];

  const takenColors = players.map((p) => p.colorIndex).filter((c) => c !== null);

  const addHuman = () => {
    if (players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [...prev, makePlayer(prev.length)]);
  };

  const addCPU = () => {
    if (players.length >= MAX_PLAYERS) return;
    // Auto-assign first available color for CPU
    const freeIdx = COLOR_OPTIONS.findIndex((_, i) => !takenColors.includes(i));
    const opt = freeIdx >= 0 ? COLOR_OPTIONS[freeIdx] : COLOR_OPTIONS[0];
    setPlayers((prev) => [
      ...prev,
      {
        id: prev.length,
        name: `CPU ${opt.label}`,
        type: "cpu",
        colorIndex: freeIdx >= 0 ? freeIdx : null,
      },
    ]);
  };

  const removePlayer = (id) => {
    if (players.length <= 1) return;
    setPlayers((prev) =>
      prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, id: i }))
    );
  };

  const updateName = (id, value) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name: value } : p)));
  };

  const pickColor = (playerId, colorIndex) => {
    // If another player already has this color, swap them
    setPlayers((prev) => {
      const existing = prev.find((p) => p.colorIndex === colorIndex && p.id !== playerId);
      return prev.map((p) => {
        if (p.id === playerId) return { ...p, colorIndex };
        if (existing && p.id === existing.id) {
          // Give the swapped player the old color of the picker
          const pickerOldColor = prev.find((x) => x.id === playerId)?.colorIndex ?? null;
          return { ...p, colorIndex: pickerOldColor };
        }
        return p;
      });
    });
  };

  const handleStart = () => {
    const invalid = players.find((p) => p.type === "human" && !p.name.trim());
    if (invalid) return alert(`Please enter a name for Player ${invalid.id + 1}`);
    const uncolored = players.find((p) => p.colorIndex === null);
    if (uncolored) return alert(`Please pick a color for ${uncolored.name || `Player ${uncolored.id + 1}`}`);
    if (players.length < 2) return alert("Add at least 2 players to start");

    const finalPlayers = players.map((p) => {
      const opt = COLOR_OPTIONS[p.colorIndex];
      return {
        ...p,
        name:   p.type === "cpu" ? p.name : p.name.trim(),
        color:  opt.color,
        avatar: opt.avatar,
        label:  opt.label,
        score:  0,
      };
    });

    navigate("/multi-quiz", { state: { players: finalPlayers, category, difficulty } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>⚔️ Multiplayer Setup</h2>
        <p className={styles.subtitle}>Add 2–4 players · Pick your color · Mix humans &amp; CPU</p>

        {/* Player slots */}
        <div className={styles.slots}>
          {players.map((p, i) => {
            const chosen = p.colorIndex !== null ? COLOR_OPTIONS[p.colorIndex] : null;
            return (
              <div
                key={p.id}
                className={styles.slot}
                style={{ "--color": chosen?.color || "rgba(255,255,255,0.15)" }}
              >
                {/* Avatar / color indicator */}
                <span className={styles.slotAvatar}>
                  {chosen ? chosen.avatar : "⬜"}
                </span>

                {/* Name input or CPU label */}
                {p.type === "human" ? (
                  <input
                    className={styles.nameInput}
                    placeholder={`Player ${i + 1} name`}
                    value={p.name}
                    onChange={(e) => updateName(p.id, e.target.value)}
                    maxLength={16}
                  />
                ) : (
                  <span className={styles.cpuLabel}>🤖 {p.name}</span>
                )}

                {/* Color picker dots */}
                <div className={styles.colorPicker}>
                  {COLOR_OPTIONS.map((opt, ci) => {
                    const isChosen = p.colorIndex === ci;
                    const isTaken  = takenColors.includes(ci) && !isChosen;
                    return (
                      <button
                        key={ci}
                        className={`${styles.colorDot} ${isChosen ? styles.colorDotActive : ""} ${isTaken ? styles.colorDotTaken : ""}`}
                        style={{ "--dc": opt.color }}
                        onClick={() => pickColor(p.id, ci)}
                        title={opt.label}
                        aria-label={`Pick ${opt.label}`}
                      />
                    );
                  })}
                </div>

                {/* Remove (not for first player) */}
                {i > 0 && (
                  <button className={styles.removeBtn} onClick={() => removePlayer(p.id)}>✕</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add buttons */}
        {players.length < MAX_PLAYERS && (
          <div className={styles.addRow}>
            <button className={styles.addBtn} onClick={addHuman}>+ Add Player</button>
            <button className={`${styles.addBtn} ${styles.addCpuBtn}`} onClick={addCPU}>🤖 Add CPU</button>
          </div>
        )}
        {players.length >= MAX_PLAYERS && (
          <p className={styles.maxNote}>Maximum 4 players reached</p>
        )}

        {/* Quiz options */}
        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Difficulty</label>
            <select className={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button className={styles.startBtn} onClick={handleStart}>Start Game →</button>
        <button className={styles.backButton} onClick={() => navigate("/setup")}>← Back</button>
      </div>
    </div>
  );
};

export default MultiplayerSetup;
