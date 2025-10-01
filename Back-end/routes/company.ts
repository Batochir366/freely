import express from "express";
import { Request, Response } from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompaniesByUser,
  getCompanyById,
  updateCompany,
  companyUpload,
} from "../controllers/company.ts";

export const companyRouter = express.Router();

companyRouter
  .post("/create-company", createCompany as any)
  .get("/get-companies", getCompanies as any)
  .post("/get-companies-by-user", getCompaniesByUser as any)
  .get("/get-company/:companyId", getCompanyById as any)
  .put(
    "/update-company/:companyId",
    companyUpload.fields([
      { name: "images", maxCount: 10 },
      { name: "companyLogo", maxCount: 1 },
    ]),
    updateCompany as any
  )
  .delete("/delete-company/:companyId", deleteCompany as any);

export default companyRouter;
