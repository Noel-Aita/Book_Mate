import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../services/socket';
import styles from '../styles/PlayerSetupMultiplayer.module.css';

const PlayerSetupMultiplayer = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { category, difficulty } = location.state || {};

  useEffect(() => {
    // Generate a random room ID for the creator
    if (creatingRoom) {
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomId(newRoomId);
    }
  }, [creatingRoom]);

  useEffect(() => {
    const handleRoomCreated = (data) => {
      navigate('/multi-quiz', { 
        state: { 
          roomId: data.roomId, 
          username,
          isHost: true,
          category,
          difficulty
        } 
      });
    };

    const handleRoomJoined = (data) => {
      navigate('/multiplayer-quiz', { 
        state: { 
          roomId: data.roomId, 
          username,
          isHost: false,
          category: data.category,
          difficulty: data.difficulty
        } 
      });
    };

    const handleRoomError = (data) => {
      setError(data.message);
      setCreatingRoom(false);
      setJoiningRoom(false);
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-error', handleRoomError);

    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('room-error', handleRoomError);
    };
  }, [username, navigate, category, difficulty]);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setError('');
    setCreatingRoom(true);
    socket.emit('create-room', { 
      username, 
      roomId, 
      category: category || '9', 
      difficulty: difficulty || 'easy' 
    });
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      setError('Please enter both username and room ID');
      return;
    }

    setError('');
    setJoiningRoom(true);
    socket.emit('join-room', { username, roomId: roomId.toUpperCase() });
  };

  return (
    <div className="multiplayer-setup-container">
      <h1>Multiplayer Setup</h1>
      
      <div className="setup-card">
        <div className="input-group">
          <label>Your Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="action-buttons">
          <div className="create-section">
            <h3>Create a New Room</h3>
            <button 
              onClick={handleCreateRoom} 
              disabled={creatingRoom || joiningRoom}
              className="action-btn create-btn"
            >
              {creatingRoom ? 'Creating...' : 'Create Room'}
            </button>
            {creatingRoom && roomId && (
              <p className="room-info">Room ID: {roomId}</p>
            )}
          </div>

          <div className="divider">OR</div>

          <div className="join-section">
            <h3>Join an Existing Room</h3>
            <div className="join-input">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                disabled={creatingRoom || joiningRoom}
              />
              <button 
                onClick={handleJoinRoom} 
                disabled={creatingRoom || joiningRoom}
                className="action-btn join-btn"
              >
                {joiningRoom ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetupMultiplayer;