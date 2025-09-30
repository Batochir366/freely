import { Request, Response } from "express";
import UserModel from "../model/user";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, userName, firstName, lastName, photo } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" })
        .end();
    }

    try {
      const oldUser = await UserModel.find({ email: email });
      if (oldUser.length > 0) {
        return res
          .status(405)
          .send({ success: false, message: "user already exist" })
          .end();
      }

      const user = await UserModel.create({
        email,
        password,
        userName,
        firstName,
        lastName,
        photo,
        isAdmin: false, // All new users are admins by default
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
    const users = await UserModel.find({})
      .select("-password")
      .sort({ createdAt: -1 });

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

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // For now, return the first user as current user
    // In a real app, you'd get this from the JWT token or session
    const user = await UserModel.findOne().select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json({
      success: true,
      user: userResponse,
      message: "Login successful",
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(200).json({
      success: true,
      user: userResponse,
      message: "User promoted to admin successfully",
    });
  } catch (error) {
    console.error("promoteToAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
