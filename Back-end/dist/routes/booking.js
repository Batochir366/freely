"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const booking_1 = require("../controllers/booking");
exports.bookingRouter = express_1.default.Router();
exports.bookingRouter.post("/create-booking", async (req, res) => {
    try {
        await (0, booking_1.createBooking)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.bookingRouter.post("/user-bookings", async (req, res) => {
    try {
        await (0, booking_1.getBookingsByUser)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.bookingRouter.get("/company-bookings/:companyId", async (req, res) => {
    try {
        await (0, booking_1.getBookingsByCompany)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.bookingRouter.post("/update-status/:bookingId", async (req, res) => {
    try {
        await (0, booking_1.updateBookingStatus)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.bookingRouter.post("/user-company-bookings", async (req, res) => {
    try {
        await (0, booking_1.getBookingsByUserCompanies)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = exports.bookingRouter;
