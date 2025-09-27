import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

export interface RequestWithUserId extends Request {
  userId?: string;
}

export const verifyClerkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Authentication token missing" });
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const userId = payload.sub;
    if (!userId || typeof userId !== "string") {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    (req as RequestWithUserId).userId = userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
