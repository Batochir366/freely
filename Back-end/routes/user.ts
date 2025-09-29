import {
  createUser,
  getCurrentUser,
  getUsers,
  getUserById,
  loginUser,
  promoteToAdmin,
} from "../controllers/user";
import express, { Request, Response } from "express";

export const usersRouter = express.Router();

usersRouter
  .post("/create-user", createUser as any)
  .post("/login", loginUser as any)
  .get("/get-users", getUsers as any)
  .get("/get-current-user", getCurrentUser as any)
  .get("/get-user/:userId", getUserById as any)
  .post("/promote-to-admin", promoteToAdmin as any);

export default usersRouter;
