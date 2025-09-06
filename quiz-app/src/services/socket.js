// src/services/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (username) => {
  socket = io("http://localhost:5001", { query: { username } });

  socket.on("connect", () => {
    console.log("Connected to socket server:", socket.id);
  });

  return socket;
};
