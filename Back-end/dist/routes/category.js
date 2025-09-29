"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const categoryRouter = express_1.default.Router();
categoryRouter.get("/", category_1.getCategories).post("/", category_1.createCategory);
exports.default = categoryRouter;
