import express from "express";
import { Request, Response } from "express";
import {
  createBooking,
  getBookingsByUser,
  getBookingsByCompany,
  updateBookingStatus,
  getBookingsByUserCompanies,
} from "../controllers/booking";
import { verifyClerkToken } from "../middleware/checkClerkToken";

interface RequestWithUserId extends Request {
  userId: string;
}

export const bookingRouter = express.Router();

bookingRouter.post(
  "/create-booking",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await createBooking(reqWithUserId, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.get(
  "/user-bookings",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await getBookingsByUser(reqWithUserId, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.get(
  "/company-bookings/:companyId",
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await getBookingsByCompany(reqWithUserId, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.put(
  "/update-status/:bookingId",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await updateBookingStatus(reqWithUserId, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.get(
  "/user-company-bookings",
  verifyClerkToken,
  async (req: Request, res: Response) => {
    try {
      const reqWithUserId = req as RequestWithUserId;
      await getBookingsByUserCompanies(reqWithUserId, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

export default bookingRouter;
