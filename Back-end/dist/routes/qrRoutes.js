import express from "express";
import { createQrSession, scanQrCode } from "../controllers/qrController";
const router = express.Router();
router.post("/create-qr-session", createQrSession);
router.get("/scan/:qrId", scanQrCode);
export { router as qrRoutes };
//# sourceMappingURL=qrRoutes.js.map