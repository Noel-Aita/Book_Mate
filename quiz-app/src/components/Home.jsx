// src/components/Home.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');

  // Handle Start Quiz button click
  const startQuiz = () => {
    if (!selectedSubject) {
      alert('Please select a subject first.');
      return;
    }

    // Navigate to /quiz and send the selected subject
    navigate('/quiz', { state: { subject: selectedSubject } });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>📘 Welcome to EduQuiz</h1>
      <p>Please choose a subject to get started:</p>

      {/* Subject Buttons */}
      <div style={{ margin: '20px' }}>
        <button
          onClick={() => setSelectedSubject('math')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: selectedSubject === 'math' ? 'green' : 'dodgerblue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          🧮 Math
        </button>

        <button
          onClick={() => setSelectedSubject('english')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: selectedSubject === 'english' ? 'green' : 'dodgerblue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          📚 English
        </button>
      </div>

      <button
        onClick={startQuiz}
        style={{
          padding: '12px 30px',
          fontSize: '18px',
          backgroundColor: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Start Quiz ▶️
      </button>
    </div>
  );
}

export default Home;
