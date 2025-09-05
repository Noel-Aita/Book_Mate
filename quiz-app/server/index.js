require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// -----------------------
// In-memory storage
// -----------------------
const users = {}; // { username: { password } }
const rooms = {}; // { roomId: { socketId: { username, score } } }

// -----------------------
// API routes
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

app.get("/", (req, res) => {
  res.send("Quiz Multiplayer Server is running!");
});

// -----------------------
// Socket.io events
// -----------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { username, score: 0 };
    console.log(`${username} joined room ${roomId}`);
  });

  socket.on("answer", ({ roomId, answer }) => {
    if (!rooms[roomId] || !rooms[roomId][socket.id]) return;
    if (answer.correct) rooms[roomId][socket.id].score += 1;

    io.to(roomId).emit("playerAnswered", {
      username: rooms[roomId][socket.id].username,
      score: rooms[roomId][socket.id].score
    });
  });

  socket.on("finishQuiz", ({ roomId }) => {
    if (!rooms[roomId]) return;

    const finalScores = {};
    Object.values(rooms[roomId]).forEach((player) => {
      finalScores[player.username] = player.score;
    });

    io.to(roomId).emit("gameOver", finalScores);
    delete rooms[roomId];
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) delete rooms[roomId][socket.id];
      if (Object.keys(rooms[roomId]).length === 0) delete rooms[roomId];
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
