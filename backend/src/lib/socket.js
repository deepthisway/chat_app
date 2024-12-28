import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"]
    }
})

export function getReceiverSocketId(userId)   {
    return userSocketMap[userId];
}

// used to store the online users{socket id} of each user
const userSocketMap = {}


io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId)  {
        userSocketMap[userId]= socket.id;
    }
    // broadcase even to tall the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io, server, app};

