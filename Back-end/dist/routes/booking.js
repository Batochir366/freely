import express from "express";
import { createBooking, getBookingsByUser, getBookingsByCompany, updateBookingStatus, getBookingsByUserCompanies, } from "../controllers/booking";
export const bookingRouter = express.Router();
bookingRouter.post("/create-booking", async (req, res) => {
    try {
        await createBooking(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
bookingRouter.post("/user-bookings", async (req, res) => {
    try {
        await getBookingsByUser(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
bookingRouter.get("/company-bookings/:companyId", async (req, res) => {
    try {
        await getBookingsByCompany(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
bookingRouter.post("/update-status/:bookingId", async (req, res) => {
    try {
        await updateBookingStatus(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
bookingRouter.post("/user-company-bookings", async (req, res) => {
    try {
        await getBookingsByUserCompanies(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
export default bookingRouter;
//# sourceMappingURL=booking.js.map