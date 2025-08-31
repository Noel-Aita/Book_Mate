import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import decodeHtml from "../utils/decodeHtml";
import  localQuestions from "../data/localQuestions";
import styles from "./QuizScreen.module.css";

const QuizScreen = ({ category, difficulty }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `https://opentdb.com/api.php?amount=5&category=18&type=multiple`
        );
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();

        const formatted = (data.results || localQuestions).map((q) => ({
          ...q,
          all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));

        setQuestions(formatted);
      } catch (err) {
        console.warn("API failed, using local questions", err);
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

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentIndex]: answer });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goBack = () => navigate("/category");

  const submitQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) score++;
    });
    navigate("/result", { state: { score, totalQuestions: questions.length } });
  };

  if (loading) return <p>Loading questions...</p>;
  const q = questions[currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h2>
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p>{decodeHtml(q.question)}</p>

        <div className={styles.answers}>
          {q.all_answers.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(ans)}
              className={answers[currentIndex] === ans ? styles.selected : ""}
            >
              {decodeHtml(ans)}
            </button>
          ))}
        </div>

        <div className={styles.navigation}>
          <button onClick={goBack}>Back</button>
          <button onClick={prevQuestion} disabled={currentIndex === 0}>
            Previous
          </button>
          <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1}>
            Next
          </button>
          {currentIndex === questions.length - 1 && (
            <button onClick={submitQuiz}>Submit</button>
          )}
        </div>
      </div>

      <div className={styles.rightPane}>
        <h3>Daily Blogs</h3>
        <div className={styles.blogList}>
          <div className={styles.blogCard}>
            <img src="/images/blog1.jpg" alt="Science" />
            <p>Explore fascinating science facts and experiments daily.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/blog2.jpg" alt="Arts" />
            <p>Discover music, arts, and photography insights.</p>
          </div>
          <div className={styles.blogCard}>
            <img src="/images/blog3.jpg" alt="Tech" />
            <p>Learn about the latest technology and innovations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
