import { Request, Response } from "express";
import ReviewModel from "../model/review";
import CompanyModel from "../model/company";
import UserModel from "../model/user"; // Import UserModel
// Authentication middleware removed

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId, name, starCount, comment } = req.body;

    // Create review without requiring user authentication
    const review = await ReviewModel.create({
      company: companyId,
      user: "anonymous", // Use anonymous for non-authenticated reviews
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

    const reviews = await ReviewModel.find({ company: companyId }).sort({
      createdAt: -1,
    });

    // Get user details for each review (handle anonymous reviews)
    const userIds = [...new Set(reviews.map((review) => review.user))].filter(
      (id) => id !== "anonymous"
    );
    const users = await UserModel.find({ _id: { $in: userIds } });
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    const reviewsWithUsers = reviews.map((review) => ({
      ...review.toObject(),
      user:
        review.user === "anonymous"
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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const getReviewsByUserCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userId || (req as any).userId || "default-user";

    const userCompanies = await CompanyModel.find({ user: userId });
    const companyIds = userCompanies.map((company) => company._id);

    const reviews = await ReviewModel.find({
      company: { $in: companyIds },
    }).populate("company", "name");

    const userIds = [...new Set(reviews.map((review) => review.user))];

    const users = await UserModel.find({ _id: { $in: userIds } });
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
