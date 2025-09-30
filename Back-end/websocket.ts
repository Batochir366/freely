import WebSocket from "ws";
import { Server } from "http";
import { sessions } from "./controllers/qrController";

export const initWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server }); // ✅ зөв

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const { qrId } = JSON.parse(message.toString());
        if (qrId) {
          sessions.set(qrId, ws);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      for (const [key, socket] of sessions.entries()) {
        if (socket === ws) {
          sessions.delete(key);
        }
      }
    });
  });

  console.log("✅ WebSocket server ready");
};
