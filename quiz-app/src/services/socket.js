import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
  socket = io("http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => console.log("Socket connected:", socket.id));
  socket.on("connect_error", (err) => console.error("Socket error:", err.message));

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket(token) first.");
  return socket;
};
