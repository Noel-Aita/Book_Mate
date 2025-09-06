import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow your frontend origin if needed
    methods: ["GET", "POST"],
  },
});

const PORT = 5001;

// Rooms data structure
const rooms = {}; // { roomId: { players: [{id, username}], currentPlayer: 0 } }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], currentPlayer: 0 };
    }

    // Add player if not already in room
    const exists = rooms[roomId].players.find((p) => p.id === socket.id);
    if (!exists) {
      rooms[roomId].players.push({ id: socket.id, username });
    }

    socket.join(roomId);

    // Broadcast current players
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);

    // Broadcast current player
    io.to(roomId).emit(
      "currentPlayer",
      rooms[roomId].players[rooms[roomId].currentPlayer]
    );

    console.log(
      `Player ${username} joined room ${roomId}. Players now:`,
      rooms[roomId].players
    );
  });

  // Handle answer submission
  socket.on("answerSubmitted", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    // Move to next player
    room.currentPlayer = (room.currentPlayer + 1) % room.players.length;

    // Broadcast new current player
    io.to(roomId).emit(
      "currentPlayer",
      room.players[room.currentPlayer]
    );
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove player from all rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const index = room.players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        io.to(roomId).emit("updatePlayers", room.players);
      }

      // Delete room if empty
      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});
