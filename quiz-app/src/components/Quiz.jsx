// import React and usetsate hook for tracking quiz state
import React, {useState} from 'react';
// import our questions fromthe data folder
import allQuestions from '../data/questions';
// import useNavigate so wecan go tothe reultpage when the quiz ends
import { useLocation, useNavigate } from 'react-router-dom';




function Quiz() {
  const navigate = useNavigate(); // Hook to programmatically change pages

  const location = useLocation();



  const { subject } = location.state ||{ subject: 'math' }; // Hardcoded subject for now (we'll let users choose later)

  const quizQuestions = allQuestions[subject] || []; // Get the questions for the selected subject
  

  const [currentIndex, setCurrentIndex] = useState(0); // Tracks which question we're on
  const [score, setScore] = useState(0);               // Tracks the user's score
  const [selectedOption, setSelectedOption] = useState(''); // Tracks the user's selected answer

if (!quizQuestions.length) {
  return <p>No questions found for subject: {subject}</p>;
}

  const currentQuestion = quizQuestions[currentIndex]; // Get the current question object

  // Function to handle what happens when a user clicks an answer option
  const handleOptionClick = (option) => {
    setSelectedOption(option); // Highlight the clicked option

    // Check if it's correct and increase score if true
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    // After 1 second, move to next question or finish the quiz
    setTimeout(() => {
      setSelectedOption(null); // Reset the selection

      const nextIndex = currentIndex + 1;

      if (nextIndex < quizQuestions.length) {
        // Move to next question
        setCurrentIndex(nextIndex);
      } else {
        // All questions done – go to Result screen and pass the score
        navigate('/result', {
          state: { score: score + (option === currentQuestion.answer ? 1 : 0), total: quizQuestions.length }
        });
      }
    }, 1000); // 1-second delay before switching to the next question
  };

  return (
    <div>
      {/* Display question number and total */}
      <h2>Question {currentIndex + 1} of {quizQuestions.length}</h2>

      {/* Show the question text */}
      <p>{currentQuestion.question}</p>

      {/* Display options as a list of buttons */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentQuestion.options.map((option, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption} // Disable buttons once clicked to avoid double answering
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor:
                  selectedOption === option
                    ? option === currentQuestion.answer
                      ? 'lightgreen'   // If correct, show green
                      : 'salmon'       // If wrong, show red
                    : '',
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quiz;