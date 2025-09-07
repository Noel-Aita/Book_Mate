import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/SinglePlayerQuiz.module.css';
import BlogSection from './BlogSection'; // Add this import

const SinglePlayerQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { category, difficulty } = location.state || {};

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswerSelect(null);
    }
  }, [timeLeft, isAnswered]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category || 9}&difficulty=${difficulty || 'easy'}&type=multiple`;
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
        } else {
          throw new Error('No questions found from API');
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('API failed, using local questions:', error);
      // Use local questions as fallback
      setQuestions(localQuestions);
      setError('Using offline questions. Some features may be limited.');
    } finally {
      setLoading(false);
      setTimeLeft(30);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(answer);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(30);
      } else {
        navigate('/results', { 
          state: { 
            score, 
            total: questions.length,
            mode: 'single'
          } 
        });
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading questions...</div>
        <BlogSection />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">No questions available. Please try again.</div>
        <button onClick={() => navigate('/category-difficulty')}>
          Back to Options
        </button>
        <BlogSection />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
    .sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="question-count">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="score">Score: {score}</div>
        <div className="timer">{timeLeft}s</div>
      </div>
      
      <div className="question-card">
        <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        
        <div className="options-grid">
          {options.map((option, index) => {
            let optionClass = 'option-btn';
            
            if (isAnswered) {
              if (option === currentQuestion.correct_answer) {
                optionClass += ' correct';
              } else if (option === selectedOption && option !== currentQuestion.correct_answer) {
                optionClass += ' incorrect';
              } else {
                optionClass += ' disabled';
              }
            }
            
            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            );
          })}
        </div>
      </div>
      
      <BlogSection />
    </div>
  );
};

export default SinglePlayerQuiz;