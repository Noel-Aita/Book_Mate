// src/utils/explanations.js
// Generates rich, educational explanations for quiz questions
import decodeHtml from "./decodeHtml";

const CATEGORY_CONTEXT = {
  "General Knowledge": "General knowledge covers a broad range of topics from everyday life, culture, and world affairs.",
  "Entertainment: Books": "Literature and books have shaped human thought for thousands of years, from ancient epics to modern novels.",
  "Entertainment: Film": "Cinema is one of the most powerful storytelling mediums, combining visuals, sound, and narrative.",
  "Entertainment: Music": "Music is a universal language that spans cultures, genres, and centuries of human expression.",
  "Entertainment: Video Games": "Video games are an interactive art form that blends technology, storytelling, and player agency.",
  "Science & Nature": "Science explains the natural world through observation, experimentation, and evidence-based reasoning.",
  "Science: Computers": "Computer science underpins modern technology, from software and algorithms to artificial intelligence.",
  "Science: Mathematics": "Mathematics is the foundation of logic, engineering, physics, and virtually every scientific discipline.",
  "Mythology": "Mythology reflects how ancient civilizations understood the world, morality, and the forces of nature.",
  "Sports": "Sports test human physical and mental limits, and have been central to culture since ancient times.",
  "Geography": "Geography studies the Earth's landscapes, environments, and the relationships between people and their environments.",
  "History": "History records human events, decisions, and their consequences — helping us understand how the present came to be.",
  "Politics": "Political science examines how societies organise power, governance, and collective decision-making.",
  "Art": "Art is a form of human expression that communicates ideas, emotions, and culture across time.",
  "Celebrities": "Pop culture and celebrities reflect the values, trends, and entertainment of a given era.",
  "Animals": "Zoology and animal biology reveal the incredible diversity of life on Earth and how species adapt to survive.",
  "Vehicles": "Engineering and transportation have transformed how humans move, trade, and connect across the globe.",
  "Comics": "Comics and graphic novels are a unique storytelling medium combining sequential art and narrative.",
  "Gadgets": "Technology and gadgets represent human ingenuity in solving problems and improving daily life.",
  "Anime & Manga": "Anime and manga are Japanese art forms that have become a global cultural phenomenon.",
  "Cartoon & Animations": "Animation brings characters and stories to life through the art of sequential illustration and motion.",
};

/**
 * Builds a rich, educational explanation for a quiz question.
 * @param {object} q - question object from OpenTDB
 * @returns {string} - detailed explanation
 */
export const buildExplanation = (q) => {
  const correct  = decodeHtml(q.correct_answer || "");
  const category = decodeHtml(q.category || "");
  const question = decodeHtml(q.question || "");
  const wrong    = (q.incorrect_answers || []).map(decodeHtml);

  const context = CATEGORY_CONTEXT[category] || `This question falls under the topic of ${category || "general knowledge"}.`;

  // Build a meaningful explanation based on the question structure
  let detail = "";

  // Try to give context about why the wrong answers are wrong
  if (wrong.length > 0) {
    const wrongList = wrong.slice(0, 2).join(" and ");
    detail = ` While ${wrongList} might seem plausible, they are incorrect in this context.`;
  }

  // Category-specific framing
  let frame = "";
  if (category.includes("History")) {
    frame = ` Understanding this helps build a clearer picture of how historical events unfolded and influenced the world we live in today.`;
  } else if (category.includes("Science")) {
    frame = ` This concept is fundamental to understanding how the natural or technological world operates.`;
  } else if (category.includes("Geography")) {
    frame = ` Knowing this strengthens your understanding of the world's physical and political landscape.`;
  } else if (category.includes("Sports")) {
    frame = ` This is a well-known fact in the world of sports that any enthusiast should be familiar with.`;
  } else if (category.includes("Music") || category.includes("Film") || category.includes("Entertainment")) {
    frame = ` This is a notable piece of trivia in popular culture and entertainment history.`;
  } else if (category.includes("Mathematics")) {
    frame = ` Mathematical precision is key here — the answer follows directly from established rules and formulas.`;
  } else {
    frame = ` Keeping this fact in mind will help you answer similar questions in the future.`;
  }

  return `✦ The correct answer is "${correct}".${detail} ${context}${frame}`;
};
