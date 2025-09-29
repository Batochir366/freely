"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createCategory = void 0;
const category_1 = __importDefault(require("../model/category"));
const createCategory = async (req, res) => {
    try {
        const { name, group, icons } = req.body;
        if (!name || !group || !icons) {
            res
                .status(400)
                .json({ success: false, message: "Name, group and icons are required" })
                .end();
            return;
        }
        const existingCategory = await category_1.default.findOne({ name, group });
        if (existingCategory) {
            res
                .status(400)
                .json({
                success: false,
                message: "Category with this name already exists in this group",
            })
                .end();
            return;
        }
        const category = await category_1.default.create({
            name,
            group,
            icons,
        });
        res.status(201).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_1.default.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getCategories = getCategories;
