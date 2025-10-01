import { Request, Response } from "express";
import UserModel from "../model/user";
import multer from "multer";
import path from "path";
import fs from "fs";

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

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/users");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `user-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Update user with image handling
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, userName, email } = req.body;
    const uploadedFile = req.file;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the user first
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;

    // Handle image upload/change
    if (uploadedFile) {
      // Delete old image if exists
      if (existingUser.photo) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads/users",
          existingUser.photo
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set new photo path
      updateData.photo = uploadedFile.filename;
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete (userResponse as any).password;

    res.status(200).json({
      success: true,
      user: userResponse,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete user image
export const deleteUserImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete image file if exists
    if (user.photo) {
      const imagePath = path.join(__dirname, "../uploads/users", user.photo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update user to remove photo reference
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { photo: null },
      { new: true }
    );

    // Remove password from response
    const userResponse = updatedUser?.toObject();
    if (userResponse) {
      delete (userResponse as any).password;
    }

    res.status(200).json({
      success: true,
      user: userResponse,
      message: "User image deleted successfully",
    });
  } catch (error) {
    console.error("deleteUserImage error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
