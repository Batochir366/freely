"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const qrController_js_1 = require("./controllers/qrController.js");
const initWebSocket = (server) => {
    const wss = new ws_1.default.Server({ server });
    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            try {
                const { qrId } = JSON.parse(message.toString());
                if (qrId) {
                    qrController_js_1.sessions.set(qrId, ws);
                }
            }
            catch (err) {
                console.error("Invalid WebSocket message:", err);
            }
        });
        ws.on("close", () => {
            for (const [key, socket] of qrController_js_1.sessions.entries()) {
                if (socket === ws) {
                    qrController_js_1.sessions.delete(key);
                }
            }
        });
    });
    console.log("✅ WebSocket server ready");
};
exports.initWebSocket = initWebSocket;
