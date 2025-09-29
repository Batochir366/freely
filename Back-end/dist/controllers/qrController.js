import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
const sessions = new Map();
export const createQrSession = (req, res) => {
    const qrId = uuidv4();
    res.json({ qrId });
};
export const scanQrCode = (req, res) => {
    const qrId = req.params.qrId;
    const socket = sessions.get(qrId);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ scanned: true }));
        sessions.delete(qrId);
        return res.send("QR scanned ✅");
    }
    else {
        return res.status(404).send("Invalid or expired QR");
    }
};
export { sessions };
//# sourceMappingURL=qrController.js.map