import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(
  cors({
    origin: "localhost:3000", //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["localhost:3000"],
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
    console.log(data);
    io.to(data.recipientId).emit("reciveSdp", data.sdp);
  });

  socket.on(
    "sendCandidate",
    (data: { recipientId: string; candidate: string }) => {
      io.to(data.recipientId).emit("reciveCandidate", data.candidate);
    }
  );

  // 切断イベント受信
  socket.on("disconnect", (reason) => {
    console.log(`user disconnected. reason is ${reason}.`);
  });
});

// サーバーを3000番ポートで起動
httpServer.listen(7072, () => {
  console.log("Server start on port 7072.");
});
