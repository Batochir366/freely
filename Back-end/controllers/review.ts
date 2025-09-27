import { Request, Response } from "express";
import ReviewModel from "../model/review";
import CompanyModel from "../model/company";
import UserModel from "../model/user"; // Import UserModel
import { RequestWithUserId } from "../middleware/checkClerkToken";

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId, name, starCount, comment } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const review = await ReviewModel.create({
      company: companyId,
      user: userId.toString(),
      name,
      starCount,
      comment,
    });

    await CompanyModel.findByIdAndUpdate(
      companyId,
      { $push: { reviews: review._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const getReviewsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId } = req.params;

    const reviews = await ReviewModel.find({ company: companyId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const getReviewsByUserCompanies = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const userCompanies = await CompanyModel.find({ user: userId });
    const companyIds = userCompanies.map((company) => company._id);

    const reviews = await ReviewModel.find({
      company: { $in: companyIds },
    }).populate("company", "name");

    const userIds = [...new Set(reviews.map((review) => review.user))];

    const users = await UserModel.find({ clerkId: { $in: userIds } });
    const userMap = new Map(users.map((user) => [user.clerkId, user]));

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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findByIdAndDelete(reviewId);

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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
