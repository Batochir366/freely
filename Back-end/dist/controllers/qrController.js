"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = exports.scanQrCode = exports.createQrSession = void 0;
const uuid_1 = require("uuid");
const ws_1 = __importDefault(require("ws"));
const sessions = new Map();
exports.sessions = sessions;
const createQrSession = (req, res) => {
    const qrId = (0, uuid_1.v4)();
    res.json({ qrId });
};
exports.createQrSession = createQrSession;
const scanQrCode = (req, res) => {
    const qrId = req.params.qrId;
    const socket = sessions.get(qrId);
    if (socket && socket.readyState === ws_1.default.OPEN) {
        socket.send(JSON.stringify({ scanned: true }));
        sessions.delete(qrId);
        return res.send("QR scanned ✅");
    }
    else {
        return res.status(404).send("Invalid or expired QR");
    }
};
exports.scanQrCode = scanQrCode;
