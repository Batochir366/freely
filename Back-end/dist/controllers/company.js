"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.getCompanyById = exports.updateCompany = exports.getCompaniesByUser = exports.getCompanies = exports.createCompany = void 0;
const category_1 = __importDefault(require("../model/category"));
const mongoose_1 = __importDefault(require("mongoose"));
const company_1 = __importDefault(require("../model/company"));
const createCompany = async (req, res) => {
    const { name, description, location, phoneNumber, categoryIds, socialMedia, images, companyLogo, pricing, userId, } = req.body;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, message: "userId is required" })
            .end();
    }
    const userObjectId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
    try {
        const validCategories = await category_1.default.find({
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
        const newCompany = await company_1.default.create({
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
    }
    catch (error) {
        console.error(error, "err");
        return res.status(400).json({ success: false, message: error }).end();
    }
};
exports.createCompany = createCompany;
const getCompanies = async (req, res) => {
    const { q, categories } = req.query;
    try {
        const filter = {};
        if (q) {
            const searchRegex = new RegExp(q, "i");
            filter.$or = [
                { name: searchRegex },
                { phoneNumber: searchRegex },
                { "socialMedia.Facebook": searchRegex },
                { "socialMedia.instagram": searchRegex },
                { "socialMedia.website": searchRegex },
                { "location.address": searchRegex },
            ];
        }
        if (categories) {
            const categoryArray = Array.isArray(categories)
                ? categories
                : [categories];
            const categoryObjectIds = categoryArray.map((id) => new mongoose_1.default.Types.ObjectId(id));
            filter.category = { $in: categoryObjectIds };
        }
        const companies = await company_1.default.find(filter)
            .populate("category")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, companies });
    }
    catch (error) {
        console.error("Get/Search error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getCompanies = getCompanies;
const getCompaniesByUser = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, message: "userId is required" });
    }
    try {
        const userObjectId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        const companies = await company_1.default.find({ user: userObjectId }).sort({
            createdAt: -1,
        });
        return res.status(200).json({ success: true, companies }).end();
    }
    catch (error) {
        console.error(error, "err");
        return res.status(400).json({ success: false, message: error }).end();
    }
};
exports.getCompaniesByUser = getCompaniesByUser;
const updateCompany = async (req, res) => {
    const { userId } = req.body;
    const companyId = req.params.companyId;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, message: "userId is required" });
    }
    try {
        const userObjectId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        const company = await company_1.default.findOneAndUpdate({ user: userObjectId, _id: companyId }, req.body, { new: true });
        if (!company) {
            return res
                .status(404)
                .json({ success: false, message: "Company not found" })
                .end();
        }
        return res.status(200).json({ success: true, company }).end();
    }
    catch (error) {
        console.error(error, "err");
        return res.status(400).json({ success: false, message: error }).end();
    }
};
exports.updateCompany = updateCompany;
const getCompanyById = async (req, res) => {
    const companyId = req.params.companyId;
    try {
        const company = await company_1.default.findById(companyId);
        if (!company) {
            return res
                .status(404)
                .json({ success: false, message: "Company not found" })
                .end();
        }
        return res.status(200).json({ success: true, company }).end();
    }
    catch (error) {
        console.error(error, "err");
        return res.status(400).json({ success: false, message: error }).end();
    }
};
exports.getCompanyById = getCompanyById;
const deleteCompany = async (req, res) => {
    const { userId } = req.body;
    const companyId = req.params.companyId;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, message: "userId is required" });
    }
    try {
        const userObjectId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        const company = await company_1.default.findOneAndDelete({
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
    }
    catch (error) {
        console.error(error, "err");
        return res.status(400).json({ success: false, message: error }).end();
    }
};
exports.deleteCompany = deleteCompany;
