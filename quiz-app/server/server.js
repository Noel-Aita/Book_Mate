import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const __dirname = path.resolve();
const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = "supersecretkey"; // keep this secret in production
const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Helper: read users from JSON
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Helper: write users to JSON
const writeUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });

  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = { username, password };
  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, username });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, username });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.username = payload.username;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.username);

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.username);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
