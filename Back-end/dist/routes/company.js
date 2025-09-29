import express from "express";
import { createCompany, deleteCompany, getCompanies, getCompaniesByUser, getCompanyById, updateCompany, } from "../controllers/company";
export const companyRouter = express.Router();
companyRouter
    .post("/create-company", createCompany)
    .get("/get-companies", getCompanies)
    .post("/get-companies-by-user", getCompaniesByUser)
    .get("/get-company/:companyId", getCompanyById)
    .post("/update-company/:companyId", updateCompany)
    .post("/delete-company/:companyId", deleteCompany);
export default companyRouter;
//# sourceMappingURL=company.js.map