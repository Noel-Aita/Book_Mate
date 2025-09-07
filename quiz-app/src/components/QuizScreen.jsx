// src/components/QuizScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml"; // helper to decode HTML entities
import localQuestions from "../data/localQuestions"; // fallback questions
import styles from "./QuizScreen.module.css";

const QuizScreen = ({ category, difficulty }) => {
  const [questions, setQuestions] = useState([]);       // All questions (API or local)
  const [currentIndex, setCurrentIndex] = useState(0);  // Current question index
  const [answers, setAnswers] = useState({});           // Selected answers
  const [loading, setLoading] = useState(true);        // Loading state
  const navigate = useNavigate();

  // Shuffle helper to randomize answer choices
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  // Fetch questions from API with fallback to local questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `https://opentdb.com/api.php?amount=5&category=18&type=multiple`
        );
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setQuestions(
            data.results.map((q) => ({
              ...q,
              all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
            }))
          );
        } else {
          console.warn("API returned no results, using local questions");
          setQuestions(
            localQuestions.map((q) => ({
              ...q,
              all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
            }))
          );
        }
      } catch (err) {
        console.error("API failed, using local questions:", err);
        setQuestions(
          localQuestions.map((q) => ({
            ...q,
            all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Save selected answer for current question
  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentIndex]: answer });
  };

  // Go to next question
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Go to previous question
  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Go back to category selection
  const goBack = () => {
    navigate("/category");
  };

  // Submit quiz and navigate to result screen
  const submitQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) score++;
    });
    navigate("/results", { state: { score, totalQuestions: questions.length } });
  };

  if (loading) return <p>Loading questions...</p>;

  const q = questions[currentIndex];

  return (
    <div className={styles.container}>
      {/* Left side: Quiz content */}
      <div>
        <form className={styles.quizSide}>
        <h2>
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p>{decodeHtml(q.question)}</p>

        {q.all_answers.map((ans, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAnswer(ans)}
            className={
              answers[currentIndex] === ans
                ? `${styles.answerButton} ${styles.selectedAnswer}`
                : styles.answerButton
            }
          >
            {decodeHtml(ans)}
          </button>
        ))}

        <div className={styles.navigation}>
          <button
          type="button" 
          onClick={goBack}>Back</button>
          <button 
          type="button"
          onClick={prevQuestion} disabled={currentIndex === 0}>
            Previous
          </button>
          <button
            type="button"
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </button>
          {currentIndex === questions.length - 1 && (
            <button 
            type="button"
            onClick={submitQuiz} className={styles.submitButton}>
              Submit
            </button>
          )}
        </div>
        </form>
      </div>

      {/* Right side: Blog section */}
      <div className={styles.blogPane}>
        <h3 className={styles.blogTitle}>Daily Blogs</h3>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img
              src="/images/science.jpg"
              alt="Science"
              className={styles.blogImage}
            />
            <p>Explore fascinating science facts and experiments daily.</p>
          </div>
          <div className={styles.blogCard}>
            <img
              src="/images/art.jpg"
              alt="Arts"
              className={styles.blogImage}
            />
            <p>Discover music, arts, and photography insights.</p>
          </div>
          <div className={styles.blogCard}>
            <img
              src="/images/tech-3.jpg"
              alt="Tech"
              className={styles.blogImage}
            />
            <p>Learn about the latest technology and innovations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
