import express from "express";
import { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  getReviewsByCompany,
  getReviewsByUserCompanies,
} from "../controllers/review";
import {
  RequestWithUserId,
  verifyClerkToken,
} from "../middleware/checkClerkToken";

export const reviewsRouter = express.Router();

reviewsRouter.post(
  "/create-review",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      await createReview(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

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

reviewsRouter.get(
  "/user-company-reviews",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await getReviewsByUserCompanies(reqWithUserId, res);
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
  verifyClerkToken,
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
