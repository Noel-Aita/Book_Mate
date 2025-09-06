import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    // Connect to the backend socket server
    socket = io("http://localhost:5001", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      socket = null;
    });
  }
  return socket;
};
