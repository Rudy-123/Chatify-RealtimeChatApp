import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../Middleware/socketAuthMiddleware.js";
import User from "../Models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("A User Connected", socket.user.fullname);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  //Mark DB online
  await User.findByIdAndUpdate(userId, { online: true });

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("A User Disconnected", socket.user.fullname);

    delete userSocketMap[userId];

    // Mark DB offline
    await User.findByIdAndUpdate(userId, { online: false });

    // Broadcast updated list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
