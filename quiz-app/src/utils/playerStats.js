// src/utils/playerStats.js — XP, ranks, badges, bookmarks via localStorage

export const RANKS = [
  { name: "Beginner",    minXP: 0,    icon: "🌱", color: "#6ee7b7" },
  { name: "Learner",     minXP: 100,  icon: "📖", color: "#60a5fa" },
  { name: "Scholar",     minXP: 300,  icon: "🎓", color: "#a78bfa" },
  { name: "Expert",      minXP: 600,  icon: "🔬", color: "#f59e0b" },
  { name: "Master",      minXP: 1000, icon: "🏆", color: "#ef4444" },
  { name: "Legend",      minXP: 2000, icon: "⚡", color: "#fcd34d" },
];

export const BADGES = [
  { id: "first_win",      label: "First Win",      icon: "🎯", desc: "Complete your first quiz"              },
  { id: "perfect_round",  label: "Perfect Round",  icon: "💯", desc: "Score 100% on any quiz"               },
  { id: "history_buff",   label: "History Buff",   icon: "📜", desc: "Complete a History quiz"              },
  { id: "science_geek",   label: "Science Geek",   icon: "🔭", desc: "Complete a Science quiz"              },
  { id: "sports_fan",     label: "Sports Fan",     icon: "⚽", desc: "Complete a Sports quiz"               },
  { id: "geo_master",     label: "Geo Master",     icon: "🌍", desc: "Complete a Geography quiz"            },
  { id: "comeback_king",  label: "Comeback King",  icon: "👑", desc: "Score 80%+ after scoring below 40%"  },
  { id: "streak_3",       label: "On Fire",        icon: "🔥", desc: "Get a 3-answer streak"                },
  { id: "streak_5",       label: "Unstoppable",    icon: "⚡", desc: "Get a 5-answer streak"                },
  { id: "bookworm",       label: "Bookworm",       icon: "📚", desc: "Bookmark 5 questions"                 },
  { id: "speed_demon",    label: "Speed Demon",    icon: "⚡", desc: "Answer correctly in under 5 seconds"  },
  { id: "daily_player",   label: "Daily Player",   icon: "📅", desc: "Play on 3 different days"             },
];

const KEY = "bookmate_stats";

const defaultStats = () => ({
  xp:          0,
  totalGames:  0,
  bestStreak:  0,
  lastPlayed:  null,
  daysPlayed:  [],
  badges:      [],
  bookmarks:   [],   // array of question objects
  history:     [],   // last 10 results { score, total, category, date }
});

export const getStats = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultStats(), ...JSON.parse(raw) } : defaultStats();
  } catch { return defaultStats(); }
};

export const saveStats = (stats) => {
  try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch {}
};

export const getRank = (xp) =>
  [...RANKS].reverse().find((r) => xp >= r.minXP) || RANKS[0];

export const getNextRank = (xp) => {
  const idx = RANKS.findIndex((r) => r === getRank(xp));
  return RANKS[idx + 1] || null;
};

export const xpForResult = ({ score, total, streak, timeBonus }) => {
  let xp = score * 10;                          // 10 XP per correct answer
  if (total > 0 && score === total) xp += 50;  // perfect round bonus
  xp += Math.min(streak, 5) * 5;               // streak bonus (max 25)
  xp += timeBonus || 0;                         // speed bonus
  return xp;
};

// Call after each quiz to update stats and return newly earned badges
export const updateStats = ({ score, total, category, streak, timeBonus, prevScore }) => {
  const stats    = getStats();
  const earned   = xpForResult({ score, total, streak, timeBonus });
  const pct      = total > 0 ? score / total : 0;
  const today    = new Date().toDateString();
  const newBadges = [];

  stats.xp         += earned;
  stats.totalGames += 1;
  stats.bestStreak  = Math.max(stats.bestStreak, streak || 0);
  stats.lastPlayed  = today;

  if (!stats.daysPlayed.includes(today)) stats.daysPlayed.push(today);

  // Record history
  stats.history = [
    { score, total, category, date: today, pct: Math.round(pct * 100) },
    ...stats.history,
  ].slice(0, 10);

  // ── Badge checks ──
  const award = (id) => {
    if (!stats.badges.includes(id)) {
      stats.badges.push(id);
      newBadges.push(BADGES.find((b) => b.id === id));
    }
  };

  if (stats.totalGames === 1)                          award("first_win");
  if (pct === 1)                                       award("perfect_round");
  if (category?.includes("History"))                   award("history_buff");
  if (category?.includes("Science"))                   award("science_geek");
  if (category?.includes("Sports"))                    award("sports_fan");
  if (category?.includes("Geography"))                 award("geo_master");
  if (pct >= 0.8 && prevScore !== undefined && prevScore < 0.4) award("comeback_king");
  if ((streak || 0) >= 3)                              award("streak_3");
  if ((streak || 0) >= 5)                              award("streak_5");
  if (stats.bookmarks.length >= 5)                     award("bookworm");
  if (stats.daysPlayed.length >= 3)                    award("daily_player");

  saveStats(stats);
  return { newBadges, xpEarned: earned, stats };
};

export const addBookmark = (question) => {
  const stats = getStats();
  const exists = stats.bookmarks.find(
    (b) => b.question === question.question
  );
  if (!exists) {
    stats.bookmarks = [question, ...stats.bookmarks].slice(0, 50);
    saveStats(stats);
  }
};

export const removeBookmark = (questionText) => {
  const stats = getStats();
  stats.bookmarks = stats.bookmarks.filter((b) => b.question !== questionText);
  saveStats(stats);
};
