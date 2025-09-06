// server/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// 👉 LOGIN ENDPOINT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple demo logic (replace with DB if needed)
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing credentials" });
  }

  console.log(`User logged in: ${username}`);
  res.json({ success: true, username });
});

// 👉 SOCKET SETUP
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    io.to(roomId).emit("player-joined", username);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
