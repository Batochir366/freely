"use client";

import React, { useEffect } from "react";
import { format, addDays, isWeekend, startOfDay, isSameDay } from "date-fns";
import { ChevronRight, Wallet, ChevronLeft, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import { useParams } from "next/navigation";
import { QrBooking } from "@/components/QrBooking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScan } from "@/app/context/ScanContext";
import { toast, Toaster } from "sonner";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
interface BackendBooking {
  _id: string;
  bookingDate: string;
  startTime: string;
  status: string;
}

interface Booking {
  id: string;
  date: Date;
  time: string;
  status: "pending" | "booked" | "cancelled" | "selected";
  price: number;
  isSale: boolean;
}

export const BookingDate = ({ price }: { price: number | undefined }) => {
  const [currentStartDate, setCurrentStartDate] = React.useState<Date>(
    startOfDay(new Date())
  );
  const [days, setDays] = React.useState<Date[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [bookingsBackend, setBookingsBackend] = React.useState<Booking[]>([]);
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);

  const { scanned, setScanned } = useScan();
  const params = useParams();

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {};

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const newDays = Array.from({ length: 7 }, (_, i) =>
      addDays(currentStartDate, i)
    );
    setDays(newDays);
    // Reset selected day when week changes
    setSelectedDay(null);
  }, [currentStartDate]);

  const handleNextWeek = () => {
    setCurrentStartDate((prev) => addDays(prev, 7));
  };

  const handlePreviousWeek = () => {
    setCurrentStartDate((prev) => addDays(prev, -7));
  };

  const timeSlots = React.useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const hour = i + 9;
      const nextHour =
        hour + 1 > 23 ? "00" : (hour + 1).toString().padStart(2, "0");

      return {
        time: `${hour.toString().padStart(2, "0")}:00-${nextHour}:00`,
        price: price,
        isSale: false,
      };
    });
  }, [price]);

  const handleSlotClick = (date: Date, timeSlot: string) => {
    const existingBooking = bookings.find(
      (booking) => isSameDay(booking.date, date) && booking.time === timeSlot
    );

    if (existingBooking) {
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== existingBooking.id)
      );
    } else {
      const newBooking: Booking = {
        id: `${date.toISOString()}-${timeSlot}-${Date.now()}`,
        date: startOfDay(date),
        time: timeSlot,
        status: "pending",
        price: timeSlots.find((ts) => ts.time === timeSlot)?.price || 1,
        isSale: timeSlots.find((ts) => ts.time === timeSlot)?.isSale || false,
      };

      setBookings((prev) => [...prev, newBooking]);
    }
  };

  const handleRemoveBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  const formatTimeTo24Hour = (timeStr: string): string => {
    const [time, period] = timeStr.split(/(?=[AP]M)/);
    const [hoursStr, minutes] = time.split(":");
    let hours = Number.parseInt(hoursStr, 10);

    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const getBookingForSlot = (date: Date, timeSlot: string) => {
    const localBooking = bookings.find(
      (booking) => isSameDay(booking.date, date) && booking.time === timeSlot
    );

    if (localBooking) return localBooking;

    const formattedDate = format(date, "yyyy-MM-dd");
    const [startTime] = timeSlot.split("-");
    const slotStartTime24 = formatTimeTo24Hour(startTime);

    const backendBooking = (
      bookingsBackend as unknown as BackendBooking[]
    ).find((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const bookingDateStr = format(bookingDate, "yyyy-MM-dd");

      const bookingTime24 = booking.startTime.includes(" ")
        ? formatTimeTo24Hour(booking.startTime)
        : booking.startTime;

      return (
        bookingDateStr === formattedDate && bookingTime24 === slotStartTime24
      );
    });

    if (backendBooking) {
      return {
        id: backendBooking._id,
        date: new Date(backendBooking.bookingDate),
        time: timeSlot,
        status: backendBooking.status as
          | "pending"
          | "booked"
          | "cancelled"
          | "selected",
        price: 0,
        isSale: false,
      };
    }

    return null;
  };

  const getStatusClass = (booking: Booking | null) => {
    if (!booking) return "bg-white hover:bg-blue-50 cursor-pointer";

    switch (booking.status) {
      case "booked":
        return "bg-green-100 text-green-500 cursor-not-allowed";
      case "pending":
        return "bg-blue-500 text-white cursor-not-allowed";
      default:
        return "bg-red-100 text-red-800 cursor-not-allowed";
    }
  };

  const handleBooking = () => {
    const fetchBooking = async () => {
      try {
        for (const booking of bookings) {
          try {
            if (!booking.time || typeof booking.time !== "string") {
              throw new Error("Invalid time format");
            }

            const [startTime, endTime] = booking.time.split("-");

            if (!startTime || !endTime) {
              throw new Error("Invalid time slots");
            }

            const formattedDate = format(booking.date, "yyyy-MM-dd");
            console.log("working");
            await axiosInstance.post("/booking/create-booking", {
              companyId: params.id,
              bookingDate: formattedDate,
              startTime,
              endTime,
              price: booking.price,
            });
          } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooking();
    toast("time booked successfully");
  };

  const fetchBookingData = () => {
    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(
          `/booking/company-bookings/${params.id}`
        );
        setBookingsBackend(res.data.bookings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooking();
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  useEffect(() => {
    if (scanned == true) {
      handleBooking();
      setBookings([]);
    }
    setScanned(false);
    fetchBookingData();
  }, [scanned]);

  // Mobile Day Selection Component
  const MobileDaySelector = () => (
    <div className="md:hidden mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Select Date</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() =>
              setSelectedDay(
                selectedDay && isSameDay(selectedDay, day) ? null : day
              )
            }
            className={`p-2 rounded-lg text-center transition-colors ${
              selectedDay && isSameDay(selectedDay, day)
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            } ${isWeekend(day) ? "border border-red-500/30" : ""}`}
          >
            <div className="text-xs">{format(day, "EEE")}</div>
            <div className="text-sm font-bold">{format(day, "d")}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile Time Slots Component
  const MobileTimeSlots = () => {
    if (!selectedDay) {
      return (
        <div className="md:hidden text-center py-8 text-white/70">
          Select a date above to view available time slots
        </div>
      );
    }

    return (
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {format(selectedDay, "EEEE, MMM d")}
          </h3>
          <button
            onClick={() => setSelectedDay(null)}
            className="p-1 rounded-full hover:bg-white/20"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((timeSlot) => {
            const currentBooking = getBookingForSlot(
              selectedDay,
              timeSlot.time
            );
            const slotBooked = !!currentBooking;

            return (
              <button
                key={timeSlot.time}
                onClick={() =>
                  !slotBooked && handleSlotClick(selectedDay, timeSlot.time)
                }
                disabled={slotBooked}
                className={`p-3 rounded-lg text-left transition-colors ${
                  slotBooked
                    ? currentBooking?.status === "booked"
                      ? "bg-green-100 text-green-100 cursor-not-allowed"
                      : currentBooking?.status === "pending"
                      ? "bg-blue-500 text-white cursor-not-allowed"
                      : "bg-red-100 text-red-800 cursor-not-allowed"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="font-medium text-sm mb-1">{timeSlot.time}</div>
                {!slotBooked ? (
                  <div className="text-xs">
                    {timeSlot.isSale && (
                      <span className="text-red-400 font-medium">SALE </span>
                    )}
                    {timeSlot.price?.toLocaleString()} ₮
                  </div>
                ) : (
                  <div className="text-xs font-medium">
                    {currentBooking?.status === "pending"
                      ? "Selected"
                      : currentBooking?.status === "booked"
                      ? "Booked"
                      : "Cancelled"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Toaster />
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <div className="p-3 md:p-4 border-b">
          <div className="w-full">
            {/* Booked Time Slots Section */}
            <div className="mb-6 md:mb-8 p-3 md:p-4 bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <h3 className="text-lg font-semibold text-white">
                  📅 Booked Time Slots
                </h3>
                {bookings.length > 0 && (
                  <Sheet>
                    <SheetTrigger className="bg-white/10 text-white border-2 px-4 py-2 rounded text-sm hover:bg-blue-700 w-full sm:w-auto">
                      Cashout ({bookings.length})
                    </SheetTrigger>
                    <SheetContent className="w-full sm:w-[540px] md:w-[720px] lg:w-[900px] z-50 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Confirm Your Bookings</SheetTitle>
                        <SheetDescription>
                          Review your selected time slots before confirming
                        </SheetDescription>

                        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                          {bookings.map((booking, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg border flex flex-col gap-2"
                            >
                              <div className="font-medium text-lg">
                                {format(booking.date, "MMM d, yyyy")}
                              </div>
                              <div className="text-gray-600">
                                Time: {booking.time}
                              </div>
                              <div className="text-gray-600">
                                Price: {booking.price.toLocaleString()} ₮
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Status: </span>
                                <span
                                  className={`font-medium ${
                                    booking.status === "booked"
                                      ? "text-green-600"
                                      : booking.status === "pending"
                                      ? "text-blue-600"
                                      : booking.status === "selected"
                                      ? "text-blue-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {booking.status.charAt(0).toUpperCase() +
                                    booking.status.slice(1)}
                                </span>
                              </div>

                              {booking.isSale && (
                                <div className="text-sm text-red-600 font-medium">
                                  ON SALE
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 space-y-4">
                          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-green-700 font-medium">
                                    Total Price
                                  </p>
                                  <p className="text-2xl font-bold text-green-500">
                                    {bookings
                                      .reduce(
                                        (acc, curr) => acc + curr.price,
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                    ₮
                                  </p>
                                </div>
                                <Wallet className="h-8 w-8 text-green-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Dialog>
                            <DialogTrigger className="w-full py-1 text-lg font-medium text-white bg-black border-black border-solid border-2 rounded-lg">
                              Confirm Booking
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                              </DialogHeader>
                              <QrBooking />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bookings.map((booking, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/10 backdrop-blur-sm border-white/20 rounded border flex flex-col gap-2"
                    >
                      <div className="font-medium text-white/90 text-sm">
                        {format(booking.date, "MMM d, yyyy")}
                      </div>
                      <div className="text-white/70 text-sm">
                        Time: {booking.time}
                      </div>
                      <div className="text-white/70 text-sm">
                        Price: {booking.price.toLocaleString()} ₮
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Status: </span>
                        <span
                          className={`font-medium text-sm ${
                            booking.status === "booked"
                              ? "text-green-400"
                              : booking.status === "pending"
                              ? "text-blue-400"
                              : booking.status === "selected"
                              ? "text-blue-400"
                              : "text-red-400"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBooking(booking.id);
                        }}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                      {booking.isSale && (
                        <div className="text-red-400 font-medium text-sm">
                          On Sale!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No bookings yet. Click on a time slot to book it.
                </p>
              )}
            </div>

            {/* Desktop Calendar Header */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Ulaanbaatar</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePreviousWeek}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="flex items-center text-blue-400 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                >
                  Next week <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Components */}
            <MobileDaySelector />
            <MobileTimeSlots />

            {/* Desktop Calendar Grid */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2">
                  {/* Empty cell for time column header */}
                  <div className="h-16"></div>

                  {/* Day headers */}
                  {days.map((day, i) => (
                    <div
                      key={i}
                      className={`text-center p-2 font-medium ${
                        isWeekend(day) ? "text-red-400" : ""
                      }`}
                    >
                      <div className="text-sm text-white/70">
                        {format(day, "EEEE")}
                      </div>
                      <div className="text-lg font-bold text-white/90">
                        {format(day, "MMM d")}
                      </div>
                    </div>
                  ))}

                  {/* Time slots and booking grid */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <React.Fragment key={timeSlot.time}>
                      {/* Time label */}
                      <div className="flex items-center justify-end pr-2 text-sm text-white/70 min-h-[3rem]">
                        {timeSlot.time}
                      </div>

                      {/* Booking slots for each day */}
                      {days.map((day, dayIndex) => {
                        const currentBooking = getBookingForSlot(
                          day,
                          timeSlot.time
                        );
                        const slotBooked = !!currentBooking;

                        return (
                          <div
                            key={`${dayIndex}-${timeIndex}`}
                            className={`rounded bg-white/10 border-white/20 min-h-[3rem] flex items-center justify-center transition-colors ${getStatusClass(
                              currentBooking
                            )}`}
                            onClick={() =>
                              !slotBooked && handleSlotClick(day, timeSlot.time)
                            }
                          >
                            {!slotBooked ? (
                              <div className="rounded flex flex-col items-center px-2 py-1 text-white hover:bg-gray-700 transition-colors">
                                {timeSlot.isSale && (
                                  <div className="text-xs text-red-400 font-medium">
                                    SALE
                                  </div>
                                )}
                                <div className="font-medium text-sm">
                                  {timeSlot.price?.toLocaleString()} ₮
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-sm font-medium px-2 py-1">
                                {currentBooking?.status === "pending"
                                  ? "Selected"
                                  : currentBooking?.status === "booked"
                                  ? "Booked"
                                  : currentBooking?.status === "cancelled"
                                  ? "Cancelled"
                                  : ""}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
