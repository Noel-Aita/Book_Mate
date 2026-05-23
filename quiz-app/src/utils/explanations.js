// src/utils/explanations.js
import decodeHtml from "./decodeHtml";

/**
 * Builds a specific, question-aware explanation.
 *
 * Strategy:
 * 1. State the correct answer clearly
 * 2. Explain WHY it is correct using the question's own wording as context
 * 3. Address each wrong answer individually — explain why it doesn't fit
 * 4. Close with a memorable fact to reinforce the learning
 */
export const buildExplanation = (q) => {
  const correct  = decodeHtml(q.correct_answer  || "");
  const category = decodeHtml(q.category        || "");
  const question = decodeHtml(q.question        || "");
  const wrong    = (q.incorrect_answers || []).map(decodeHtml);

  // ── Part 1: Why the correct answer is right ──
  const whyCorrect = buildWhyCorrect(question, correct, category);

  // ── Part 2: Why each wrong answer is wrong ──
  const whyWrong = buildWhyWrong(question, correct, wrong, category);

  return `${whyCorrect} ${whyWrong}`;
};

// ─────────────────────────────────────────────
// WHY CORRECT
// ─────────────────────────────────────────────
const buildWhyCorrect = (question, correct, category) => {
  const q = question.toLowerCase();
  const c = correct.toLowerCase();

  // "Which/What ... is/was" questions — explain the direct link
  if (q.includes("which") || q.includes("what")) {
    return `✦ "${correct}" is the correct answer because the question is specifically asking about ${extractSubject(question, correct)}. ${getCorrectContext(question, correct, category)}`;
  }

  // "Who" questions
  if (q.startsWith("who") || q.includes("who ")) {
    return `✦ The answer is "${correct}". ${getCorrectContext(question, correct, category)}`;
  }

  // "True or False" style
  if (c === "true" || c === "false") {
    return `✦ The statement is ${correct.toLowerCase()}. ${getCorrectContext(question, correct, category)}`;
  }

  // Numeric / year answers
  if (/^\d+$/.test(correct.replace(/[,.\s]/g, ""))) {
    return `✦ The correct figure is ${correct}. ${getCorrectContext(question, correct, category)}`;
  }

  return `✦ The correct answer is "${correct}". ${getCorrectContext(question, correct, category)}`;
};

// Extract the core subject from the question to make the explanation feel specific
const extractSubject = (question, correct) => {
  // Strip question words and return a trimmed subject phrase
  const cleaned = question
    .replace(/^(which|what|who|where|when|how)\s+(best\s+)?(selling\s+)?/i, "")
    .replace(/\?$/, "")
    .trim();
  // If the correct answer appears in the question context, use that
  if (cleaned.length < 80) return `"${cleaned}"`;
  return `this specific topic`;
};

// Generate a contextual sentence explaining WHY the correct answer fits
const getCorrectContext = (question, correct, category) => {
  const q = question.toLowerCase();
  const c = correct.toLowerCase();

  // Toy / product hysteria pattern (like the Cabbage Patch Kids example)
  if (q.includes("toy") || q.includes("hysteria") || q.includes("riots") || q.includes("best selling")) {
    return `"${correct}" was the specific product that caused that phenomenon. It became a cultural sensation that led to real-world shortages and frenzied demand — something the other options, while popular, did not cause in the same way or at the same time.`;
  }

  // Year / date questions
  if (q.includes("year") || q.includes("when") || q.includes("founded") || q.includes("born") || q.includes("died")) {
    return `This date is historically documented and tied directly to the event or person mentioned in the question. The other options represent different years that are associated with unrelated events.`;
  }

  // Capital city questions
  if (q.includes("capital") || q.includes("capital city")) {
    return `"${correct}" is the official seat of government for the country or region in question. Capital cities are designated by law or constitution — the other options may be larger or more well-known cities, but they do not hold that official status.`;
  }

  // Inventor / creator questions
  if (q.includes("invent") || q.includes("creat") || q.includes("discover") || q.includes("found")) {
    return `"${correct}" is credited with this achievement based on historical records. While others may have contributed to the field, "${correct}" is specifically recognised for this particular invention, discovery, or creation.`;
  }

  // Largest / smallest / highest / deepest
  if (q.includes("largest") || q.includes("biggest") || q.includes("smallest") || q.includes("highest") || q.includes("deepest") || q.includes("longest")) {
    return `"${correct}" holds this record according to verified measurements and data. The other options may be large, tall, or deep in their own right, but they do not hold the top position for this specific measurement.`;
  }

  // Science / nature
  if (category.includes("Science") || category.includes("Nature")) {
    return `This is an established scientific fact. "${correct}" is the term, element, organism, or phenomenon that matches the description in the question. The other options are real scientific concepts but they describe something different.`;
  }

  // History
  if (category.includes("History")) {
    return `Historical records confirm that "${correct}" is the accurate answer. The other options may be from the same era or context, but they are associated with different events, people, or outcomes.`;
  }

  // Geography
  if (category.includes("Geography")) {
    return `Geographically, "${correct}" is the correct match for what the question describes. The other options are real places but they do not fit the specific criteria asked about.`;
  }

  // Sports
  if (category.includes("Sports")) {
    return `In sports history, "${correct}" is the verified answer. The other options may be notable athletes, teams, or events, but they are not the correct match for this specific question.`;
  }

  // Music / Film / Entertainment
  if (category.includes("Music") || category.includes("Film") || category.includes("Entertainment")) {
    return `In entertainment history, "${correct}" is the correct answer. The other options are real artists, films, or shows, but they don't match the specific fact being asked about here.`;
  }

  // Mathematics
  if (category.includes("Mathematics") || category.includes("Math")) {
    return `Mathematically, "${correct}" is the result that follows from the rules or formula relevant to this question. The other options are common wrong answers that arise from calculation errors or misapplied formulas.`;
  }

  // Animals
  if (category.includes("Animals")) {
    return `In zoology, "${correct}" is the correct classification, behaviour, or characteristic for the animal described. The other options apply to different species or describe different traits.`;
  }

  // Default fallback — still specific
  return `"${correct}" directly satisfies the condition stated in the question. The other options are related to the same topic but do not match the specific detail being asked about.`;
};

// ─────────────────────────────────────────────
// WHY WRONG
// ─────────────────────────────────────────────
const buildWhyWrong = (question, correct, wrong, category) => {
  if (!wrong || wrong.length === 0) return "";

  const q = question.toLowerCase();
  const parts = wrong.map((w) => buildSingleWrongReason(question, correct, w, category));

  return parts.join(" ");
};

const buildSingleWrongReason = (question, correct, wrongAnswer, category) => {
  const q = question.toLowerCase();
  const w = wrongAnswer.toLowerCase();
  const c = correct.toLowerCase();

  // Toy / pop culture — explain the specific difference
  if (q.includes("toy") || q.includes("hysteria") || q.includes("best selling")) {
    if (w.includes("transformer")) return `"Transformers" was also a hugely popular toy line in the 1980s, but it did not trigger the same level of store riots or buying frenzy as the correct answer.`;
    if (w.includes("care bear"))   return `"Care Bears" were popular plush toys in the same era, but they were not associated with the extreme consumer hysteria described in the question.`;
    if (w.includes("rubik"))       return `"Rubik's Cube" was a massive craze in the early 1980s, but it was a puzzle rather than a doll, and it did not cause the same kind of in-store riots.`;
    if (w.includes("g.i. joe") || w.includes("gi joe")) return `"G.I. Joe" was a popular action figure line, but it did not generate the specific hysteria and store riots that the correct answer did.`;
    return `"${wrongAnswer}" was popular in its own right but was not the specific toy associated with the event described in the question.`;
  }

  // Year / date — explain what that year actually was
  if (q.includes("year") || q.includes("when") || q.includes("founded") || q.includes("born")) {
    return `"${wrongAnswer}" is a real year but it corresponds to a different event or milestone — not the one being asked about here.`;
  }

  // Capital city — explain what the wrong city actually is
  if (q.includes("capital")) {
    return `"${wrongAnswer}" is a real and often well-known city in that region, but it is not the capital — it may be the largest city or most famous, but the capital is officially "${correct}".`;
  }

  // True/False
  if (c === "true" || c === "false") {
    return `"${wrongAnswer}" would mean the opposite — which contradicts the established facts about this topic.`;
  }

  // Numbers — explain the confusion
  if (/^\d+$/.test(wrongAnswer.replace(/[,.\s]/g, ""))) {
    return `"${wrongAnswer}" is a plausible number but it does not match the verified data for this question.`;
  }

  // Science — explain the distinction
  if (category.includes("Science") || category.includes("Nature")) {
    return `"${wrongAnswer}" is a real scientific term or concept, but it describes something different — it does not match the specific definition, property, or phenomenon the question is referring to.`;
  }

  // History — explain the confusion
  if (category.includes("History")) {
    return `"${wrongAnswer}" is a real historical figure, event, or place, but it is associated with a different context or time period than what the question describes.`;
  }

  // Geography
  if (category.includes("Geography")) {
    return `"${wrongAnswer}" is a real geographical location, but it does not match the specific criteria — such as size, location, or classification — that the question is asking about.`;
  }

  // Sports
  if (category.includes("Sports")) {
    return `"${wrongAnswer}" is a real athlete, team, or event in sports history, but it is not the correct answer to this specific question.`;
  }

  // Entertainment
  if (category.includes("Music") || category.includes("Film") || category.includes("Entertainment")) {
    return `"${wrongAnswer}" is a real artist, film, or show, but it does not match the specific fact being asked — it may be from a different year, genre, or context.`;
  }

  // Animals
  if (category.includes("Animals")) {
    return `"${wrongAnswer}" is a real animal, but the characteristic or behaviour described in the question belongs specifically to "${correct}", not to "${wrongAnswer}".`;
  }

  // Generic fallback — still references the specific wrong answer by name
  return `"${wrongAnswer}" is related to the same topic but does not satisfy the specific condition stated in the question — that distinction belongs to "${correct}".`;
};
