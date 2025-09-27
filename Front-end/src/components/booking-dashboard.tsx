"use client";

import { useState, useEffect } from "react";
import { BookingCard } from "./booking-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrCurrency } from "react-icons/gr";

import { Calendar, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axios";

interface Booking {
  _id: string;
  user: string;
  company: {
    _id: string;
    name: string;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/booking/user-bookings");
      setBookings(res.data.bookings);
      setIsLoading(false);
    } catch (error) {
      console.log(error, "failed to fetch data");
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-[250px] mx-auto" />
          <div className="h-4 w-[400px] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-[100px] mb-2" />
                <div className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    booked: bookings.filter((b: Booking) => b.status === "booked").length,
    cancelled: bookings.filter((b: Booking) => b.status === "cancelled").length,

    revenue: bookings.reduce(
      (sum, booking: Booking) => sum + parseFloat(booking.price),
      0
    ),
  };

  return (
    <div className="container mx-auto p-6 space-y-8 h-screen overflow-scroll scrollbar-hide">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl relative text-white font-bold text-shadow-2xl  tracking-tight">
          Booking Dashboard
        </h1>
        <p className="text-muted-foreground  ">
          Manage your bookings with style and efficiency
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-r relative from-slate-300 to-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r relative from-slate-200 to-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booked</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.booked}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-bl relative from-green-400 to-blue-500 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.cancelled}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b relative from-blue-400 to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <GrCurrency className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenue.toLocaleString()}

              <span className="text-2xl font-bold">₮ </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {bookings.map((booking, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <BookingCard booking={booking} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
