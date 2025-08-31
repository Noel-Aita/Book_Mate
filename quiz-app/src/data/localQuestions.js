// src/data/localQuestions.js
// ✅ Local fallback questions in case the API fails or rate-limits.
// Each object matches the API structure: question, correct_answer, incorrect_answers.

const localQuestions = [
  {
    question: "What is 2 + 2?",
    correct_answer: "4",
    incorrect_answers: ["3", "5", "22"],
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Earth", "Jupiter", "Saturn"],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    correct_answer: "William Shakespeare",
    incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
  },
  {
    question: "What is the capital of Japan?",
    correct_answer: "Tokyo",
    incorrect_answers: ["Kyoto", "Osaka", "Hiroshima"],
  },
  {
    question: "Which gas do plants absorb during photosynthesis?",
    correct_answer: "Carbon Dioxide",
    incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
  },
  {
    question: "What is the largest mammal on Earth?",
    correct_answer: "Blue Whale",
    incorrect_answers: ["Elephant", "Giraffe", "Shark"],
  },
  {
    question: "How many continents are there on Earth?",
    correct_answer: "7",
    incorrect_answers: ["5", "6", "8"],
  },
  {
    question: "In computing, what does 'CPU' stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: ["Computer Power Unit", "Central Power Utility", "Core Processing Utility"],
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    correct_answer: "Oxygen",
    incorrect_answers: ["Gold", "Osmium", "Oxide"],
  },
  {
    question: "Which ocean is the largest?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
  },
  {
    question: "What is the smallest prime number?",
    correct_answer: "2",
    incorrect_answers: ["1", "3", "5"],
  },
  {
    question: "What is the freezing point of water in Celsius?",
    correct_answer: "0",
    incorrect_answers: ["-32", "32", "100"],
  },
  {
    question: "Who painted the Mona Lisa?",
    correct_answer: "Leonardo da Vinci",
    incorrect_answers: ["Michelangelo", "Raphael", "Vincent van Gogh"],
  },
  {
    question: "Which programming language is primarily used for web styling?",
    correct_answer: "CSS",
    incorrect_answers: ["HTML", "JavaScript", "Python"],
  },
  {
    question: "What year did World War II end?",
    correct_answer: "1945",
    incorrect_answers: ["1939", "1940", "1950"],
  },
];

// ✅ Default export so QuizScreen.jsx can import it directly
export default localQuestions;
