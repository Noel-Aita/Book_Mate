import React, { useState } from "react";
import styles from "./QuizScreen.module.css";

const bg = new URL("../assets/bg.jpg", import.meta.url).href;

const QuizScreen = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress percentage
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Handle answer click
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1); // update score if correct
    }
  };

  // Move to next question or finish quiz
  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onFinish(score); // pass final score to App.jsx
    }
  };

  // Determine button style dynamically
  const getAnswerClass = (answer) => {
    if (!selectedAnswer) return styles.answerButton;
    if (answer === currentQuestion.correct_answer) return `${styles.answerButton} ${styles.correct}`;
    if (answer === selectedAnswer) return `${styles.answerButton} ${styles.wrong}`;
    return styles.answerButton;
  };

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className={styles.card}>
        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <h2 className={styles.question}>{currentQuestion.question}</h2>

        <div className={styles.answers}>
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              className={getAnswerClass(answer)}
              disabled={!!selectedAnswer} // prevent changing answer
            >
              {answer}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={styles.nextButton}
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;
