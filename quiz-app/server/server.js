import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';

const app = express();
const server = createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

// In-memory storage for rooms (in production, use a database)
const rooms = new Map();

// In-memory storage for users (in production, use a database)
const users = new Map();

// Pre-populate with some test users
users.set('test@example.com', {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password' // In real app, store hashed passwords
});

users.set('user@example.com', {
  id: 2,
  name: 'Demo User',
  email: 'user@example.com',
  password: 'demo123'
});

// API route for authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Check if user exists
  const user = users.get(email);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  // Check password (in real app, compare hashed passwords)
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password // In real app, hash this password
  };
  
  users.set(email, newUser);
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
});

// Get all users (for testing purposes)
app.get('/api/users', (req, res) => {
  const usersList = Array.from(users.values()).map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersList);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create-room', (data) => {
    const { username, roomId, category, difficulty } = data;
    
    const room = {
      id: roomId,
      host: socket.id,
      players: [{ id: socket.id, name: username, score: 0, isHost: true }],
      category,
      difficulty,
      gameState: 'waiting',
      questionPool: [],
      currentQuestion: null,
      currentPlayer: null
    };
    
    rooms.set(roomId, room);
    socket.join(roomId);
    
    socket.emit('room-created', { roomId });
    io.to(roomId).emit('player-joined', { players: room.players });
  });

  // Join an existing room
  socket.on('join-room', (data) => {
    const { username, roomId } = data;
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('room-error', { message: 'Room not found' });
      return;
    }
    
    if (room.players.length >= 4) {
      socket.emit('room-error', { message: 'Room is full' });
      return;
    }
    
    room.players.push({ id: socket.id, name: username, score: 0, isHost: false });
    socket.join(roomId);
    
    socket.emit('room-joined', { 
      roomId, 
      category: room.category, 
      difficulty: room.difficulty 
    });
    
    io.to(roomId).emit('player-joined', { players: room.players });
  });

  // Start the game
  socket.on('start-game', async (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);
    
    if (!room || room.host !== socket.id) return;
    
    try {
      // Fetch questions from Open Trivia API
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${room.category}&difficulty=${room.difficulty}&type=multiple`
      );
      
      room.questionPool = response.data.results;
      room.gameState = 'playing';
      room.currentPlayer = room.players[0].id;
      
      // Select first question
      room.currentQuestion = room.questionPool.shift();
      
      io.to(roomId).emit('game-started', {
        questionPool: room.questionPool,
        currentQuestion: room.currentQuestion,
        currentPlayer: room.currentPlayer
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      socket.emit('room-error', { message: 'Failed to start game' });
    }
  });

  // Handle player answering a question
  socket.on('answer-question', (data) => {
    const { roomId, answer, questionId } = data;
    const room = rooms.get(roomId);
    
    if (!room || room.currentPlayer !== socket.id) return;
    
    const isCorrect = answer === room.currentQuestion.correct_answer;
    
    // Update player score
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.score += isCorrect ? 1 : 0;
    }
    
    socket.emit('answer-result', { correct: isCorrect });
    io.to(roomId).emit('answer-result', { 
      playerId: socket.id, 
      correct: isCorrect 
    });
    
    // Move to next player after a delay
    setTimeout(() => {
      const currentPlayerIndex = room.players.findIndex(p => p.id === socket.id);
      const nextPlayerIndex = (currentPlayerIndex + 1) % room.players.length;
      room.currentPlayer = room.players[nextPlayerIndex].id;
      
      io.to(roomId).emit('turn-changed', { 
        currentPlayer: room.currentPlayer 
      });
    }, 2000);
  });

  // Handle player selecting next question
  socket.on('select-question', (data) => {
    const { roomId, question } = data;
    const room = rooms.get(roomId);
    
    if (!room || room.currentPlayer !== socket.id) return;
    
    room.currentQuestion = question;
    
    io.to(roomId).emit('new-question', { 
      question: room.currentQuestion,
      currentPlayer: room.currentPlayer
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from rooms
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          if (room.host === socket.id) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
          }
          
          io.to(roomId).emit('player-left', { players: room.players });
        }
      }
    }
  });
});

const PORT = 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available test users:');
  console.log('Email: test@example.com, Password: password');
  console.log('Email: user@example.com, Password: demo123');
});