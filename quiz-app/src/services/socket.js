// src/services/socket.js
import { io } from "socket.io-client";

let socket = null;

/**
 * Connects a socket with the given username
 * @param {string} username
 * @returns {Socket} socket.io client instance
 */
export const connectSocket = (username) => {
  if (!socket) {
    // Connect to backend server
    socket = io("http://localhost:5000", {
      query: { username },
      autoConnect: true,
      reconnection: true,   // automatically reconnect if connection drops
    });

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }
  return socket;
};

/**
 * Returns the existing socket instance
 */
export const getSocket = () => {
  if (!socket) throw new Error("Socket not connected. Call connectSocket(username) first.");
  return socket;
};
