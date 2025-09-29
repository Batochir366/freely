import express from "express";
import { createReview, deleteReview, getReviewsByCompany, getReviewsByUserCompanies, } from "../controllers/review";
export const reviewsRouter = express.Router();
reviewsRouter.post("/create-review", async (req, res) => {
    try {
        await createReview(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
reviewsRouter.get("/reviews/:companyId", async (req, res) => {
    try {
        await getReviewsByCompany(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
reviewsRouter.post("/user-company-reviews", async (req, res) => {
    try {
        await getReviewsByUserCompanies(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
reviewsRouter.delete("/delete-review/:reviewId", async (req, res) => {
    try {
        await deleteReview(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
export default reviewsRouter;
//# sourceMappingURL=review.js.map