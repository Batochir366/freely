import express from "express";
import { Request, Response } from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompaniesByUser,
  getCompanyById,
  updateCompany,
} from "../controllers/company";

export const companyRouter = express.Router();

companyRouter
  .post("/create-company", createCompany as any)
  .get("/get-companies", getCompanies as any)
  .post("/get-companies-by-user", getCompaniesByUser as any)
  .get("/get-company/:companyId", getCompanyById as any)
  .post("/update-company/:companyId", updateCompany as any)
  .post("/delete-company/:companyId", deleteCompany as any);

export default companyRouter;
