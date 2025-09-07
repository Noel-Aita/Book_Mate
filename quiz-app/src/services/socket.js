import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? window.location.hostname : 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false
});