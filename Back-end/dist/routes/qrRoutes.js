"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrRoutes = void 0;
const express_1 = __importDefault(require("express"));
const qrController_1 = require("../controllers/qrController");
const router = express_1.default.Router();
exports.qrRoutes = router;
router.post("/create-qr-session", qrController_1.createQrSession);
router.get("/scan/:qrId", qrController_1.scanQrCode);
