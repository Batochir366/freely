"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getBookingsByUserCompanies = exports.getBookingsByCompany = exports.getBookingsByUser = exports.createBooking = exports.createBookings = void 0;
const booking_1 = __importDefault(require("../model/booking"));
const company_1 = __importDefault(require("../model/company"));
const user_1 = __importDefault(require("../model/user"));
const createBookings = async (req, res) => {
    try {
        const { bookings } = req.body;
        const userId = req.userId || "default-user";
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const bookingPromises = bookings.map(async (bookingData) => {
            const formattedStartTime = bookingData.startTime.length === 5
                ? bookingData.startTime
                : bookingData.startTime.replace(/:/g, "");
            const formattedEndTime = bookingData.endTime.length === 5
                ? bookingData.endTime
                : bookingData.endTime.replace(/:/g, "");
            const [year, month, day] = bookingData.bookingDate.split("-").map(Number);
            const bookingDate = new Date(Date.UTC(year, month - 1, day));
            return booking_1.default.create({
                user: userId,
                company: bookingData.companyId,
                bookingDate: bookingDate,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                price: parseFloat(bookingData.price),
                status: "booked",
            });
        });
        const createdBookings = await Promise.all(bookingPromises);
        res.status(200).json({
            success: true,
            bookings: createdBookings,
            totalAmount: bookings.reduce((acc, booking) => acc + parseFloat(booking.price), 0),
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createBookings = createBookings;
const createBooking = async (req, res) => {
    try {
        const { companyId, bookingDate, startTime, endTime, price, userId, userEmail, } = req.body;
        let finalUserId = userId;
        if (userEmail && !userId) {
            const user = await user_1.default.findOne({ email: userEmail });
            if (!user) {
                res.status(200).json({
                    success: false,
                    message: "User not found with the provided email. Please check the email address and try again.",
                });
                return;
            }
            finalUserId = user._id.toString();
        }
        if (!finalUserId) {
            res.status(401).json({
                success: false,
                message: "User ID or User Email is required",
            });
            return;
        }
        const formattedStartTime = startTime.length === 5 ? startTime : startTime.replace(/:/g, "");
        const formattedEndTime = endTime.length === 5 ? endTime : endTime.replace(/:/g, "");
        const booking = await booking_1.default.create({
            user: finalUserId,
            company: companyId,
            bookingDate: new Date(bookingDate),
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            price: parseFloat(price),
            status: "booked",
        });
        res.status(200).json({
            success: true,
            booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createBooking = createBooking;
const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await user_1.default.findOne({ _id: userId });
        const bookings = await booking_1.default.find({ user: userId })
            .populate("company", "name")
            .sort({ createdAt: -1 });
        const enrichedBookings = bookings.map((booking) => ({
            ...booking.toObject(),
            user: user || {
                userName: "Unknown User",
                firstName: "Unknown",
                lastName: "User",
            },
        }));
        res.status(200).json({
            success: true,
            bookings: enrichedBookings,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.getBookingsByUser = getBookingsByUser;
const getBookingsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const bookings = await booking_1.default.find({ company: companyId })
            .populate("user", "name")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            bookings,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.getBookingsByCompany = getBookingsByCompany;
const getBookingsByUserCompanies = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const userCompanies = await company_1.default.find({ user: userId });
        const companyIds = userCompanies.map((company) => company._id);
        const bookings = await booking_1.default.find({ company: { $in: companyIds } })
            .populate("company", "name")
            .sort({ bookingDate: -1, startTime: -1 });
        const userIds = [...new Set(bookings.map((booking) => booking.user))];
        const users = await user_1.default.find({ _id: { $in: userIds } });
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));
        const bookingsWithUsers = bookings.map((booking) => ({
            ...booking.toObject(),
            user: userMap.get(booking.user) || {
                userName: "Unknown User",
                firstName: "Unknown",
                lastName: "User",
            },
        }));
        res.status(200).json({
            success: true,
            bookings: bookingsWithUsers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.getBookingsByUserCompanies = getBookingsByUserCompanies;
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const booking = await booking_1.default.findOneAndUpdate({ _id: bookingId, company: { $exists: true } }, { status }, { new: true });
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
exports.updateBookingStatus = updateBookingStatus;
