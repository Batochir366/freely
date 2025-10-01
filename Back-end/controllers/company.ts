import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import categoryModel from "../model/category";
import mongoose from "mongoose";
import CompanyModel from "../model/company";
export const createCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    name,
    description,
    location,
    phoneNumber,
    categoryIds,
    socialMedia,
    images,
    companyLogo,
    pricing,
    userId,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" })
      .end();
  }

  // Convert userId to ObjectId if it's a string
  const userObjectId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  try {
    const validCategories = await categoryModel.find({
      _id: {
        $in: categoryIds,
      },
    });

    if (validCategories.length !== categoryIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid categories" })
        .end();
    }
    const newCompany = await CompanyModel.create({
      user: userObjectId,
      name,
      description,
      location,
      phoneNumber,
      category: categoryIds,
      socialMedia,
      images,
      companyLogo,
      pricing,
    });
    return res.status(200).json({ success: true, newCompany }).end();
  } catch (error) {
    console.error(error, "err");
    return res.status(400).json({ success: false, message: error }).end();
  }
};

interface GetCompaniesQuery {
  q?: string;
  categories?: string[] | string;
}

export const getCompanies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { q, categories } = req.query;

  try {
    const filter: Record<string, unknown> = {};

    // Text search
    if (q) {
      const searchRegex = new RegExp(q as string, "i");
      filter.$or = [
        { name: searchRegex },
        { phoneNumber: searchRegex },
        { "socialMedia.Facebook": searchRegex },
        { "socialMedia.instagram": searchRegex },
        { "socialMedia.website": searchRegex },
        { "location.address": searchRegex },
      ];
    }

    // Category filter
    if (categories) {
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories];

      const categoryObjectIds = categoryArray.map(
        (id) => new mongoose.Types.ObjectId(id as string)
      );

      filter.category = { $in: categoryObjectIds };
    }

    // Fetch and populate categories
    const companies = await CompanyModel.find(filter)
      .populate("category") // <-- this line populates the category field
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error("Get/Search error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompaniesByUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    // Convert userId to ObjectId if it's a string
    const userObjectId =
      typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    const companies = await CompanyModel.find({ user: userObjectId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, companies }).end();
  } catch (error) {
    console.error(error, "err");
    return res.status(400).json({ success: false, message: error }).end();
  }
};

// Configure multer for company image uploads
const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/companies");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `company-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const companyFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const companyUpload = multer({
  storage: companyStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for company images
  },
  fileFilter: companyFileFilter,
});

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    userId,
    name,
    description,
    location,
    phoneNumber,
    categoryIds,
    socialMedia,
    pricing,
    images,
  } = req.body;
  const companyId = req.params.companyId;
  const uploadedFiles = req.files as Express.Multer.File[];

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    // Convert userId to ObjectId if it's a string
    const userObjectId =
      typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    // Find existing company
    const existingCompany = await CompanyModel.findOne({
      user: userObjectId,
      _id: companyId,
    });

    if (!existingCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (socialMedia) updateData.socialMedia = socialMedia;
    if (pricing) updateData.pricing = pricing;

    // Handle category updates
    if (categoryIds) {
      const validCategories = await categoryModel.find({
        _id: { $in: categoryIds },
      });

      if (validCategories.length !== categoryIds.length) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid categories" });
      }
      updateData.category = categoryIds;
    }

    // Handle image updates (both new uploads and existing image changes)
    if (images) {
      // If images array is provided, update it
      updateData.images = images;
      console.log("Updating images array:", images);
    }

    // Handle new image uploads
    if (uploadedFiles && uploadedFiles.length > 0) {
      // Delete old images if they exist
      if (existingCompany.images && existingCompany.images.length > 0) {
        existingCompany.images.forEach((imagePath: string) => {
          const oldImagePath = path.join(
            __dirname,
            "../uploads/companies",
            imagePath
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        });
      }

      // Set new image paths
      updateData.images = uploadedFiles.map((file) => file.filename);
    }

    // Handle company logo upload
    if (req.file) {
      // Delete old logo if exists
      if (existingCompany.companyLogo) {
        const oldLogoPath = path.join(
          __dirname,
          "../uploads/companies",
          existingCompany.companyLogo
        );
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }

      // Set new logo path
      updateData.companyLogo = req.file.filename;
    }

    const company = await CompanyModel.findOneAndUpdate(
      { user: userObjectId, _id: companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({ success: true, company }).end();
  } catch (error) {
    console.error(error, "err");
    return res.status(400).json({ success: false, message: error }).end();
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const companyId = req.params.companyId;
  try {
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" })
        .end();
    }
    return res.status(200).json({ success: true, company }).end();
  } catch (error) {
    console.error(error, "err");
    return res.status(400).json({ success: false, message: error }).end();
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.body;
  const companyId = req.params.companyId;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    // Convert userId to ObjectId if it's a string
    const userObjectId =
      typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    const company = await CompanyModel.findOneAndDelete({
      user: userObjectId,
      _id: companyId,
    });
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" })
        .end();
    }
    return res.status(200).json({ success: true, company }).end();
  } catch (error) {
    console.error(error, "err");
    return res.status(400).json({ success: false, message: error }).end();
  }
};
