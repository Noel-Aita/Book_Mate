require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// -----------------------
// In-memory storage
// -----------------------
const users = {}; // { username: { password } }
const rooms = {}; // { roomId: { players: [], questions: [], currentIndex, currentPlayerId } }

// -----------------------
// API routes (auth)
// -----------------------
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });
  if (users[username]) return res.status(400).json({ message: "Username taken" });

  users[username] = { password };
  res.json({ username, token: "demo-token-" + username });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });
  if (!users[username] || users[username].password !== password)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({ username, token: "demo-token-" + username });
});

// -----------------------
// Socket.io events
// -----------------------
io.on("connection", (socket) => {
  const { username } = socket.handshake.query;
  console.log(`${username} connected with socket ID ${socket.id}`);

  // -------------------
  // Join Room
  // -------------------
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        questions: [], // will be filled when game starts
        currentIndex: 0,
        currentPlayerId: null,
        totalQuestions: 5,
      };
    }

    rooms[roomId].players.push({
      socketId: socket.id,
      username,
      score: 0,
      answered: false,
    });

    console.log(`${username} joined room ${roomId}`);
    io.to(roomId).emit("playersUpdate", rooms[roomId].players.map(p => ({ username: p.username, score: p.score })));
  });

  // -------------------
  // Start Quiz
  // -------------------
  socket.on("startQuiz", ({ roomId, questions }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].questions = questions; // questions passed from frontend
    // Randomly select first player
    const randomIndex = Math.floor(Math.random() * rooms[roomId].players.length);
    rooms[roomId].currentPlayerId = rooms[roomId].players[randomIndex].socketId;

    io.to(roomId).emit("quizStarted", {
      currentPlayerId: rooms[roomId].currentPlayerId,
      players: rooms[roomId].players,
      question: rooms[roomId].questions[rooms[roomId].currentIndex],
    });
  });

  // -------------------
  // Answer Question
  // -------------------
  socket.on("answerQuestion", ({ roomId, answer }) => {
    const room = rooms[roomId];
    if (!room) return;

    const currentPlayer = room.players.find(p => p.socketId === room.currentPlayerId);
    if (!currentPlayer || currentPlayer.socketId !== socket.id) return; // only current player can answer

    const question = room.questions[room.currentIndex];
    if (answer === question.correct_answer) {
      currentPlayer.score += 1;
    }

    currentPlayer.answered = true;

    // Broadcast score update
    io.to(roomId).emit("playersUpdate", room.players.map(p => ({ username: p.username, score: p.score })));

    // Move to next turn
    let nextIndex = room.currentIndex + 1;
    if (nextIndex >= room.totalQuestions) {
      // Quiz over
      io.to(roomId).emit("quizEnded", room.players.map(p => ({ username: p.username, score: p.score })));
      delete rooms[roomId];
    } else {
      // Pick next player (could be chosen by current player)
      const nextPlayerIndex = (room.players.findIndex(p => p.socketId === socket.id) + 1) % room.players.length;
      room.currentPlayerId = room.players[nextPlayerIndex].socketId;
      room.currentIndex = nextIndex;

      io.to(roomId).emit("nextTurn", {
        currentPlayerId: room.currentPlayerId,
        question: room.questions[room.currentIndex],
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);

    // Remove player from all rooms
    Object.keys(rooms).forEach(roomId => {
      const room = rooms[roomId];
      room.players = room.players.filter(p => p.socketId !== socket.id);
      if (room.players.length === 0) delete rooms[roomId];
      else {
        io.to(roomId).emit("playersUpdate", room.players.map(p => ({ username: p.username, score: p.score })));
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
