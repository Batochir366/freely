"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        enum: ["Type", "Difficulty", "Activity"],
        required: true,
    },
    icons: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
});
const categoryModel = mongoose_1.default.model("Category", categorySchema);
exports.default = categoryModel;
