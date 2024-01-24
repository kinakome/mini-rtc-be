import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./models";

const app = express();
const httpServer = createServer(app);
console.log(process.env.CLIENT_BASE_URL);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
});

// コネクション確立
io.on("connection", (socket) => {
  socket.on(
    "sendCallRequest",
    (data: { answerClientId: string; offerClientId: string }) => {
      io.to(data.answerClientId).emit("reciveCallRequest", data.offerClientId);
    }
  );

  socket.on(
    "sendCallAcceptance",
    (data: { answerClientId: string; offerClientId: string }) => {
      io.to(data.offerClientId).emit(
        "reciveCallAcceptance",
        data.answerClientId
      );
    }
  );

  socket.on("sendSdp", (data: { recipientId: string; sdp: string }) => {
    io.to(data.recipientId).emit("reciveSdp", data.sdp);
  });

  // 切断イベント受信
  socket.on("disconnect", (reason) => {
    console.log(`user disconnected. reason is ${reason}.`);
  });
});

// サーバーを3000番ポートで起動
httpServer.listen(7072, () => {
  console.log("Server start on port 7072.");
});