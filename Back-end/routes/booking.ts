import express from "express";
import { Request, Response } from "express";
import {
  createBooking,
  getBookingsByUser,
  getBookingsByCompany,
  updateBookingStatus,
  getBookingsByUserCompanies,
} from "../controllers/booking.ts";

export const bookingRouter = express.Router();

bookingRouter.post("/create-booking", async (req: Request, res: Response) => {
  try {
    await createBooking(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

bookingRouter.post("/user-bookings", async (req: Request, res: Response) => {
  try {
    await getBookingsByUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

bookingRouter.get(
  "/company-bookings/:companyId",
  async (req: Request, res: Response) => {
    try {
      await getBookingsByCompany(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.post(
  "/update-status/:bookingId",
  async (req: Request, res: Response) => {
    try {
      await updateBookingStatus(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

bookingRouter.post(
  "/user-company-bookings",
  async (req: Request, res: Response) => {
    try {
      await getBookingsByUserCompanies(req, res);
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
