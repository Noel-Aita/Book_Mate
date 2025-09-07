import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../services/socket';
import BlogSection from './BlogSection';
import '../styles/MultiplayerQuiz.module.css';

const MultiplayerQuiz = () => {
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionPool, setQuestionPool] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, username, isHost, category, difficulty } = location.state || {};

  useEffect(() => {
    if (!roomId || !username) {
      navigate('/multiplayer-setup');
      return;
    }

    // Socket event listeners
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted);
    socket.on('new-question', handleNewQuestion);
    socket.on('answer-result', handleAnswerResult);
    socket.on('turn-changed', handleTurnChanged);
    socket.on('game-ended', handleGameEnded);
    socket.on('time-update', handleTimeUpdate);

    return () => {
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
      socket.off('new-question', handleNewQuestion);
      socket.off('answer-result', handleAnswerResult);
      socket.off('turn-changed', handleTurnChanged);
      socket.off('game-ended', handleGameEnded);
      socket.off('time-update', handleTimeUpdate);
    };
  }, [roomId, username, navigate]);

  const handlePlayerJoined = (data) => {
    setPlayers(data.players);
  };

  const handlePlayerLeft = (data) => {
    setPlayers(data.players);
  };

  const handleGameStarted = (data) => {
    setGameState('playing');
    setQuestionPool(data.questionPool);
    setCurrentQuestion(data.currentQuestion);
    setIsMyTurn(data.currentPlayer === socket.id);
  };

  const handleNewQuestion = (data) => {
    setCurrentQuestion(data.question);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsMyTurn(data.currentPlayer === socket.id);
  };

  const handleAnswerResult = (data) => {
    if (data.playerId === socket.id) {
      setIsAnswered(true);
    }
    
    // Update player scores
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === data.playerId 
          ? { ...player, score: player.score + (data.correct ? 1 : 0) } 
          : player
      )
    );
  };

  const handleTurnChanged = (data) => {
    setIsMyTurn(data.currentPlayer === socket.id);
  };

  const handleGameEnded = (data) => {
    setGameState('finished');
    navigate('/results', { 
      state: { 
        score: data.scores.find(s => s.playerId === socket.id)?.score || 0,
        total: data.totalQuestions,
        players: data.scores,
        mode: 'multi'
      } 
    });
  };

  const handleTimeUpdate = (data) => {
    setTimeLeft(data.timeLeft);
  };

  const handleAnswerSelect = (answer) => {
    if (!isMyTurn || isAnswered) return;
    
    setSelectedOption(answer);
    socket.emit('answer-question', {
      roomId,
      answer,
      questionId: currentQuestion.id
    });
  };

  const handleStartGame = () => {
    if (isHost) {
      socket.emit('start-game', { roomId, category, difficulty });
    }
  };

  const handleNextQuestion = (question) => {
    if (isMyTurn) {
      socket.emit('select-question', { roomId, question });
    }
  };

  if (gameState === 'waiting') {
    return (
      <div className="multiplayer-quiz-container">
        <div className="waiting-room">
          <h2>Waiting Room: {roomId}</h2>
          <div className="players-list">
            <h3>Players ({players.length})</h3>
            {players.map(player => (
              <div key={player.id} className="player-card">
                {player.name} {player.id === socket.id && '(You)'}
                {player.isHost && ' 👑'}
              </div>
            ))}
          </div>
          
          {isHost && (
            <button onClick={handleStartGame} className="start-game-btn">
              Start Game
            </button>
          )}
          
          <p>{isHost ? 'You are the host' : 'Waiting for host to start the game...'}</p>
        </div>
        <BlogSection />
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="multiplayer-quiz-container">Loading question...</div>;
  }

  return (
    <div className="multiplayer-quiz-container">
      <div className="game-header">
        <div className="room-id">Room: {roomId}</div>
        <div className="timer">{timeLeft}s</div>
        <div className="turn-indicator">{isMyTurn ? 'Your turn!' : `${players.find(p => p.isTurn)?.name}'s turn`}</div>
      </div>
      
      <div className="players-scoreboard">
        {players.map(player => (
          <div key={player.id} className={`player-score ${player.isTurn ? 'active-turn' : ''}`}>
            <span className="player-name">{player.name}</span>
            <span className="player-points">{player.score} pts</span>
          </div>
        ))}
      </div>
      
      <div className="question-card">
        <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            let optionClass = 'option-btn';
            
            if (isAnswered && option === currentQuestion.correctAnswer) {
              optionClass += ' correct';
            } else if (isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer) {
              optionClass += ' incorrect';
            } else if (!isMyTurn || isAnswered) {
              optionClass += ' disabled';
            }
            
            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={!isMyTurn || isAnswered}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            );
          })}
        </div>
      </div>
      
      {isMyTurn && isAnswered && questionPool.length > 0 && (
        <div className="question-selector">
          <h3>Select next question:</h3>
          <div className="question-pool">
            {questionPool.slice(0, 3).map((question, index) => (
              <button
                key={index}
                className="pool-question-btn"
                onClick={() => handleNextQuestion(question)}
              >
                Question {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <BlogSection />
    </div>
  );
};

export default MultiplayerQuiz;