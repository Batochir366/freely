import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

const sessions: Map<string, WebSocket> = new Map();

export const createQrSession = (req: Request, res: Response) => {
  const qrId = uuidv4();
  res.json({ qrId });
};

export const scanQrCode = (req: Request, res: Response) => {
  const qrId = req.params.qrId;
  const socket = sessions.get(qrId);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ scanned: true }));
    sessions.delete(qrId);
    return res.send("QR scanned ✅");
  } else {
    return res.status(404).send("Invalid or expired QR");
  }
};

export { sessions };
