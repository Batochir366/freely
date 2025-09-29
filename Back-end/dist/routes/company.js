"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouter = void 0;
const express_1 = __importDefault(require("express"));
const company_1 = require("../controllers/company");
exports.companyRouter = express_1.default.Router();
exports.companyRouter
    .post("/create-company", company_1.createCompany)
    .get("/get-companies", company_1.getCompanies)
    .post("/get-companies-by-user", company_1.getCompaniesByUser)
    .get("/get-company/:companyId", company_1.getCompanyById)
    .post("/update-company/:companyId", company_1.updateCompany)
    .post("/delete-company/:companyId", company_1.deleteCompany);
exports.default = exports.companyRouter;
