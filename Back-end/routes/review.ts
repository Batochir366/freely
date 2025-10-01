import express from "express";
import { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  getReviewsByCompany,
  getReviewsByUserCompanies,
} from "../controllers/review.ts";

export const reviewsRouter = express.Router();

reviewsRouter.post("/create-review", async (req: Request, res: Response) => {
  try {
    await createReview(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

reviewsRouter.get(
  "/reviews/:companyId",
  async (req: Request, res: Response) => {
    try {
      await getReviewsByCompany(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

reviewsRouter.post(
  "/user-company-reviews",
  async (req: Request, res: Response) => {
    try {
      await getReviewsByUserCompanies(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

reviewsRouter.delete(
  "/delete-review/:reviewId",
  async (req: Request, res: Response) => {
    try {
      await deleteReview(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

export default reviewsRouter;
