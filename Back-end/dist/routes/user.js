"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const user_1 = require("../controllers/user");
const express_1 = __importDefault(require("express"));
exports.usersRouter = express_1.default.Router();
exports.usersRouter
    .post("/create-user", user_1.createUser)
    .post("/login", user_1.loginUser)
    .get("/get-users", user_1.getUsers)
    .get("/get-current-user", user_1.getCurrentUser)
    .get("/get-user/:userId", user_1.getUserById)
    .post("/promote-to-admin", user_1.promoteToAdmin);
exports.default = exports.usersRouter;
