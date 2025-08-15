// src/components/Result.jsx

import React from 'react';
// useLocation allows us to receive data passed from Quiz page
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation(); // Access route state (data passed from Quiz)
  const navigate = useNavigate(); // Used to navigate back to the home screen

  // Destructure score and total questions from location.state
  const { score, total } = location.state || { score: 0, total: 1 };
 const percentage = Math.round((score / total) * 100);
  // Calculate the percentage and message
  const getMessage = () => {
 
      if (percentage === 100) return "🎉 Perfect score! You're a genius!";
    if (percentage >= 70) return "👏 Great job!";
    if (percentage >= 40) return "🙂 Not bad! Keep practicing.";
    return "😅 Don't give up! Try again.";
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🎉 Quiz Complete!</h2>
      <p>You scored <strong>{score}</strong> out of <strong>{total}</strong></p>
      <p>Your percentage: <strong>{percentage}%</strong></p>

      {/* Play Again Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: 'dodgerblue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        🔁 Try Again
      </button>
    </div>
  );
}

export default Result;
