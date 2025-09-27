import { Request, Response } from "express";
import User from "../model/user";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { clerkId, email, userName, firstName, lastName, photo, isAdmin } =
      req.body;

    if (!clerkId || !email) {
      return res
        .status(400)
        .json({ message: "clerkId and email are required" })
        .end();
    }

    try {
      const oldUser = await User.find({ email: email });
      if (oldUser.length > 0) {
        return res
          .status(405)
          .send({ success: false, message: "user already exist" })
          .end();
      }

      const user = await User.create({
        clerkId,
        email,
        userName,
        firstName,
        lastName,
        photo,
        isAdmin,
      });
      return res
        .status(200)
        .send({
          success: true,
          user: user,
        })
        .end();
    } catch (error) {
      console.error(error, "err");
      return res
        .status(400)
        .send({
          success: false,
          message: error,
        })
        .end();
    }
  } catch (error) {
    console.error(error, "err");
    return res
      .status(400)
      .send({
        success: false,
        message: error,
      })
      .end();
  }
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res
      .status(200)
      .send({
        success: true,
        users: users,
      })
      .end();
  } catch (error) {
    console.error(error, "err");
    return res
      .status(400)
      .send({
        success: false,
        message: error,
      })
      .end();
  }
};

interface RequestWithUserId extends Request {
  userId: string;
}

export const getCurrentUser = async (req: RequestWithUserId, res: Response) => {
  try {
    const clerkId = req.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
