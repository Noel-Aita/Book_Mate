import { useNavigate } from 'react-router-dom';
import styles from '../styles/ModeSelectionScreen.module.css';

const ModeSelectionScreen = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    navigate('/category-difficulty', { state: { mode } });
  };

  return (
    <div className="mode-container">
      <h1>Select Game Mode</h1>
      <div className="mode-cards">
        <div className="mode-card" onClick={() => handleModeSelect('single')}>
          <div className="mode-icon single-player"></div>
          <h2>Single Player</h2>
          <p>Test your knowledge against our question bank</p>
          <button className="mode-btn">Play Solo</button>
        </div>
        
        <div className="mode-card" onClick={() => handleModeSelect('multi')}>
          <div className="mode-icon multi-player"></div>
          <h2>Multiplayer</h2>
          <p>Challenge friends in real-time quiz battles</p>
          <button className="mode-btn">Play with Friends</button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;