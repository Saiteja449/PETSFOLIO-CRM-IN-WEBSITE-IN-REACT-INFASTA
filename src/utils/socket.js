import { io } from "socket.io-client";
import { BACKEND_URL } from "./constants.js";

// Connect to backend server
export const socket = io(BACKEND_URL, {
  autoConnect: true,
});
