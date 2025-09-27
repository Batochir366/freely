import { createUser, getCurrentUser, getUsers } from "../controllers/user";
import { verifyClerkToken } from "../middleware/checkClerkToken";
import express, { Request, Response } from "express";

interface RequestWithUserId extends Request {
  userId: string;
}

export const usersRouter = express.Router();

usersRouter
  .post("/create-user", createUser)
  .get("/get-users", getUsers)
  .get("/get-current-user", verifyClerkToken, getCurrentUser as any);

export default usersRouter;
