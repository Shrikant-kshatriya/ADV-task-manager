// context/SocketContext.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (typeof window === "undefined" || socket || !userId) return;

  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("register", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

export const getSocket = () => socket;
