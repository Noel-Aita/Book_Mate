import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import localQuestions from "../data/localQuestions";
import styles from "../styles/QuizScreen.module.css";

const QuizScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, category, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Using localQuestions instead of API
        setQuestions(localQuestions);
      } catch {
        setQuestions(localQuestions);
      }
    };
    fetchQuestions();
  }, []);

  if (!questions.length)
    return (
      <Layout>
        <p>Loading questions...</p>
      </Layout>
    );

  const current = questions[currentIndex];
  const options = [...current.incorrect_answers, current.correct_answer].sort(
    () => Math.random() - 0.5
  );

  const handleAnswer = (selected) => {
    if (selected === current.correct_answer) setScore(score + 1);
    setSelectedOption(selected);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
    } else {
      navigate("/results", { state: { score, username } });
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.question}>{current.question}</div>
        <ul className={styles.options}>
          {options.map((opt, idx) => (
            <li key={idx}>
              <button
                className={`${styles.optionButton} ${
                  selectedOption === opt ? styles.selected : ""
                }`}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedOption}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        <button
          className={styles.nextButton}
          onClick={handleNext}
          disabled={!selectedOption}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default QuizScreen;
