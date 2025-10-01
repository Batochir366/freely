import express from "express";
import { createCategory, getCategories } from "../controllers/category.ts";

const categoryRouter = express.Router();

categoryRouter
  .get("/get-categories", getCategories)
  .post("/create-category", createCategory);

export default categoryRouter;
