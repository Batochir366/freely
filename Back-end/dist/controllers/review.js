"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getReviewsByUserCompanies = exports.getReviewsByCompany = exports.createReview = void 0;
const review_1 = __importDefault(require("../model/review"));
const company_1 = __importDefault(require("../model/company"));
const user_1 = __importDefault(require("../model/user"));
const createReview = async (req, res) => {
    try {
        const { companyId, name, starCount, comment } = req.body;
        const review = await review_1.default.create({
            company: companyId,
            user: "anonymous",
            name,
            starCount,
            comment,
        });
        await company_1.default.findByIdAndUpdate(companyId, { $push: { reviews: review._id } }, { new: true });
        res.status(200).json({
            success: true,
            review,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.createReview = createReview;
const getReviewsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const reviews = await review_1.default.find({ company: companyId }).sort({
            createdAt: -1,
        });
        const userIds = [...new Set(reviews.map((review) => review.user))].filter((id) => id !== "anonymous");
        const users = await user_1.default.find({ _id: { $in: userIds } });
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));
        const reviewsWithUsers = reviews.map((review) => ({
            ...review.toObject(),
            user: review.user === "anonymous"
                ? { userName: review.name || "Anonymous", photo: null }
                : userMap.get(review.user) || {
                    userName: "Unknown User",
                    photo: null,
                },
        }));
        res.status(200).json({
            success: true,
            reviews: reviewsWithUsers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.getReviewsByCompany = getReviewsByCompany;
const getReviewsByUserCompanies = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId || "default-user";
        const userCompanies = await company_1.default.find({ user: userId });
        const companyIds = userCompanies.map((company) => company._id);
        const reviews = await review_1.default.find({
            company: { $in: companyIds },
        }).populate("company", "name");
        const userIds = [...new Set(reviews.map((review) => review.user))];
        const users = await user_1.default.find({ _id: { $in: userIds } });
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));
        const reviewsWithUsers = reviews.map((review) => ({
            ...review.toObject(),
            user: userMap.get(review.user) || {
                userName: "Unknown User",
                photo: null,
            },
        }));
        res.status(200).json({
            success: true,
            reviews: reviewsWithUsers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.getReviewsByUserCompanies = getReviewsByUserCompanies;
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await review_1.default.findByIdAndDelete(reviewId);
        if (!review) {
            res.status(404).json({
                success: false,
                message: "Review not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            review,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.deleteReview = deleteReview;
