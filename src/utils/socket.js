import { io } from "socket.io-client";

// Connect to backend server
export const socket = io("http://localhost:5000", {
  autoConnect: true,
});
