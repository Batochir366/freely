"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRouter = void 0;
const express_1 = __importDefault(require("express"));
const review_1 = require("../controllers/review");
exports.reviewsRouter = express_1.default.Router();
exports.reviewsRouter.post("/create-review", async (req, res) => {
    try {
        await (0, review_1.createReview)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.reviewsRouter.get("/reviews/:companyId", async (req, res) => {
    try {
        await (0, review_1.getReviewsByCompany)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.reviewsRouter.post("/user-company-reviews", async (req, res) => {
    try {
        await (0, review_1.getReviewsByUserCompanies)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.reviewsRouter.delete("/delete-review/:reviewId", async (req, res) => {
    try {
        await (0, review_1.deleteReview)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = exports.reviewsRouter;
