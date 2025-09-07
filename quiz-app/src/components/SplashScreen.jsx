import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SplashScreen.module.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo">
        <h1>QuizMaster</h1>
      </div>
      <div className="loading-spinner"></div>
      <p>Loading amazing quiz experience...</p>
    </div>
  );
};

export default SplashScreen;