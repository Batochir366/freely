import express from "express";
import { createQrSession, scanQrCode } from "../controllers/qrController";

const router = express.Router();

// POST /create-qr-session
router.post("/create-qr-session", createQrSession);

// GET /scan/:qrId
router.get("/scan/:qrId", scanQrCode as any);

export { router as qrRoutes };
