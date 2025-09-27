import express from "express";
import { createCategory, getCategories } from "../controllers/category";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories).post("/", createCategory);

export default categoryRouter;
