const { Server } = require("socket.io");

let io;
const connectedUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  global.io = io;
  global.connectedUsers = connectedUsers;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.join(userId);
        socket.userId = userId;
        console.log(`👤 User registered: ${userId}`);
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        socket.leave(socket.userId);
        console.log(`User disconnected: ${socket.userId}`);
      } else {
        console.log("🔌 Socket disconnected:", socket.id);
      }
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
