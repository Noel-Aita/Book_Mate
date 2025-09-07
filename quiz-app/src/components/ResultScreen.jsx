import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ResultScreen.module.css';

const ResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total, players, mode } = location.state || {};
  
  const percentage = Math.round((score / total) * 100);
  
  let resultMessage = '';
  let resultEmoji = '';
  
  if (percentage >= 90) {
    resultMessage = 'Quiz Master!';
    resultEmoji = '🎉';
  } else if (percentage >= 70) {
    resultMessage = 'Great Job!';
    resultEmoji = '👍';
  } else if (percentage >= 50) {
    resultMessage = 'Good Effort!';
    resultEmoji = '😊';
  } else {
    resultMessage = 'Keep Practicing!';
    resultEmoji = '💪';
  }

  const handlePlayAgain = () => {
    if (mode === 'single') {
      navigate('/category-difficulty', { state: { mode: 'single' } });
    } else {
      navigate('/multiplayer-setup');
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <h1>Quiz Completed!</h1>
        
        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{score}/{total}</span>
            <span className="score-percentage">{percentage}%</span>
          </div>
          <div className="result-message">
            {resultMessage} {resultEmoji}
          </div>
        </div>
        
        {mode === 'multi' && players && (
          <div className="leaderboard">
            <h2>Leaderboard</h2>
            {players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div key={player.playerId} className="leaderboard-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="player-name">{player.playerName}</span>
                  <span className="player-score">{player.score} points</span>
                </div>
              ))
            }
          </div>
        )}
        
        <div className="action-buttons">
          <button onClick={handlePlayAgain} className="play-again-btn">
            Play Again
          </button>
          <button onClick={handleGoHome} className="home-btn">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;