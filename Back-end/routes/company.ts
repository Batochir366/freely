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
import { verifyClerkToken } from "../middleware/checkClerkToken";

interface RequestWithUserId extends Request {
  userId: string;
}

export const companyRouter = express.Router();

companyRouter
  .post("/create-company", verifyClerkToken, (req: Request, res: Response) => {
    const reqWithUserId = req as RequestWithUserId;
    return createCompany(reqWithUserId, res);
  })
  .get("/get-companies", getCompanies)
  .get(
    "/get-companies-by-user",
    verifyClerkToken,
    (req: Request, res: Response) => {
      const reqWithUserId = req as RequestWithUserId;
      return getCompaniesByUser(reqWithUserId, res);
    }
  )
  .get("/get-company/:companyId", getCompanyById)
  .put(
    "/update-company/:companyId",
    verifyClerkToken,
    (req: Request, res: Response) => {
      const reqWithUserId = req as RequestWithUserId;
      return updateCompany(reqWithUserId, res);
    }
  )
  .delete(
    "/delete-company/:companyId",
    verifyClerkToken,
    (req: Request, res: Response) => {
      const reqWithUserId = req as RequestWithUserId;
      return deleteCompany(reqWithUserId, res);
    }
  );

export default companyRouter;
