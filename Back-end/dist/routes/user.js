import { createUser, getCurrentUser, getUsers, getUserById, loginUser, promoteToAdmin, } from "../controllers/user";
import express from "express";
export const usersRouter = express.Router();
usersRouter
    .post("/create-user", createUser)
    .post("/login", loginUser)
    .get("/get-users", getUsers)
    .get("/get-current-user", getCurrentUser)
    .get("/get-user/:userId", getUserById)
    .post("/promote-to-admin", promoteToAdmin);
export default usersRouter;
//# sourceMappingURL=user.js.map