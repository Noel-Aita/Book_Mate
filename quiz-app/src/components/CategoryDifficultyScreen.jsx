import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/CategoryDifficultyScreen.module.css';

const CategoryDifficultyScreen = () => {
  const [category, setCategory] = useState('9');
  const [difficulty, setDifficulty] = useState('easy');
  
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 'single';

  const categories = [
    { id: '9', name: 'General Knowledge' },
    { id: '17', name: 'Science & Nature' },
    { id: '23', name: 'History' },
    { id: '11', name: 'Entertainment: Film' },
    { id: '15', name: 'Entertainment: Video Games' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];

  const handleStart = () => {
    if (mode === 'single') {
      navigate('/single-player', { state: { category, difficulty } });
    } else {
      navigate('/multiplayer-setup', { state: { category, difficulty } });
    }
  };

  return (
    <div className="category-container">
      <h1>Select Quiz Options</h1>
      
      <div className="options-card">
        <div className="option-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="option-group">
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficulties.map((diff) => (
              <option key={diff.id} value={diff.id}>
                {diff.name}
              </option>
            ))}
          </select>
        </div>
        
        <button onClick={handleStart} className="start-btn">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default CategoryDifficultyScreen;