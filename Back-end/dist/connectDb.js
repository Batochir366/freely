"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const uri = process.env.MONGODB_URL;
const connectMongoDB = async () => {
    try {
        if (!uri) {
            throw new Error("MONGO_URI is not defined");
        }
        await (0, mongoose_1.connect)(uri);
        console.log("connected to database");
    }
    catch (error) {
        console.log(error, "err");
    }
};
exports.default = connectMongoDB;
