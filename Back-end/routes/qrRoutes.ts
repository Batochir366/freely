import express from "express";
import { createQrSession, scanQrCode } from "../controllers/qrController.ts";

const router = express.Router();

// POST /create-qr-session
router
  .post("/create-qr-session", createQrSession)
  .get("/scan/:qrId", scanQrCode as any);

// GET /scan/:qrId
router.get("/scan/:qrId", scanQrCode as any);

export { router as qrRoutes };
