import { useNavigate } from 'react-router-dom';
import styles from '../styles/HomeScreen.module.css';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="welcome-card">
        <h1>Welcome to QuizMaster!</h1>
        <p>Test your knowledge, challenge friends, and learn something new every day.</p>
        <button onClick={handleProceed} className="proceed-btn">
          Let's Get Started
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;