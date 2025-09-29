import { Request, Response } from "express";
import BookingModel from "../model/booking";
import CompanyModel from "../model/company";
import UserModel from "../model/user";

export const createBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookings } = req.body;
    const userId = (req as any).userId || "default-user";

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const bookingPromises = bookings.map(async (bookingData: any) => {
      const formattedStartTime =
        bookingData.startTime.length === 5
          ? bookingData.startTime
          : bookingData.startTime.replace(/:/g, "");
      const formattedEndTime =
        bookingData.endTime.length === 5
          ? bookingData.endTime
          : bookingData.endTime.replace(/:/g, "");

      const [year, month, day] = bookingData.bookingDate.split("-").map(Number);
      const bookingDate = new Date(Date.UTC(year, month - 1, day));

      return BookingModel.create({
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
      totalAmount: bookings.reduce(
        (acc: number, booking: any) => acc + parseFloat(booking.price),
        0
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      companyId,
      bookingDate,
      startTime,
      endTime,
      price,
      userId,
      userEmail,
    } = req.body;

    let finalUserId = userId;

    // If userEmail is provided (admin manual booking), search for user by email
    if (userEmail && !userId) {
      const user = await UserModel.findOne({ email: userEmail });
      if (!user) {
        res.status(200).json({
          success: false,
          message:
            "User not found with the provided email. Please check the email address and try again.",
        });
        return;
      }
      finalUserId = user._id.toString();
    }

    // If neither userId nor userEmail is provided, return error
    if (!finalUserId) {
      res.status(401).json({
        success: false,
        message: "User ID or User Email is required",
      });
      return;
    }

    const formattedStartTime =
      startTime.length === 5 ? startTime : startTime.replace(/:/g, "");
    const formattedEndTime =
      endTime.length === 5 ? endTime : endTime.replace(/:/g, "");

    const booking = await BookingModel.create({
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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getBookingsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await UserModel.findOne({ _id: userId });

    const bookings = await BookingModel.find({ user: userId })
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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const getBookingsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId } = req.params;
    const bookings = await BookingModel.find({ company: companyId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const getBookingsByUserCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const userCompanies = await CompanyModel.find({ user: userId });
    const companyIds = userCompanies.map((company) => company._id);

    const bookings = await BookingModel.find({ company: { $in: companyIds } })
      .populate("company", "name")
      .sort({ bookingDate: -1, startTime: -1 });

    // Get user details for each booking
    const userIds = [...new Set(bookings.map((booking) => booking.user))];
    const users = await UserModel.find({ _id: { $in: userIds } });
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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId, company: { $exists: true } },
      { status },
      { new: true }
    );

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
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
