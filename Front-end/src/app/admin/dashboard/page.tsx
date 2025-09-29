"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react";
import { BookingListsAdmin } from "@/components/BookingListsAdmin";
import axiosInstance from "@/utils/axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminBookingForm from "@/components/admin-booking-form";
import { useAuth } from "@/app/context/AuthContext";

interface Booking {
  _id: string;
  user: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
  };
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

interface Company {
  _id: string;
  name: string;
  description: string;
  location: Array<{
    address: string;
    coordinate: [number, number];
  }>;
  phoneNumber: string;
  category: string[];
  socialMedia: {
    Facebook: string;
    instagram: string;
    website: string;
  };
  images: string[];
  companyLogo: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingDataBE, setBookingDataBE] = useState<Booking[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchBookingDataBe = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        "/booking/user-company-bookings",
        { userId: user?._id }
      );
      setBookingDataBE(response.data.bookings);
    } catch (error) {
      console.log(error);
    }
  }, [user?._id]);

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        "/company/get-companies-by-user",
        { userId: user?._id }
      );
      if (response.data?.success && response.data?.companies) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchBookingDataBe();
    fetchCompanies();
  }, [fetchBookingDataBe, fetchCompanies]);

  const filteredBookings = bookingDataBE.filter((booking) => {
    const matchesCompany =
      selectedCompany === "all" || booking.company._id === selectedCompany;
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      booking.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.userName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCompany && matchesStatus && matchesSearch;
  });

  const totalBookings = bookingDataBE.length;
  const bookedCount = bookingDataBE.filter((b) => b.status === "booked").length;
  const cancelledCount = bookingDataBE.filter(
    (b) => b.status === "cancelled"
  ).length;
  const totalRevenue = bookingDataBE
    .filter((b) => b.status === "booked")
    .reduce((sum, b) => sum + Number.parseInt(b.price), 0);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setBookingDataBE((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      );

      await axiosInstance.post(`/booking/update-status/${bookingId}`, {
        status: newStatus,
        userId: user?._id,
      });

      await fetchBookingDataBe();
    } catch (error) {
      console.error("Error updating booking status:", error);

      await fetchBookingDataBe();
    }
  };

  const formatCurrency = (amount: number) => {
    // Use a simple format to avoid hydration issues
    return `₮${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 overflow-y-scroll">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w- ">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Booking Dashboard
          </h2>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {bookedCount} active, {cancelledCount} cancelled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Bookings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookedCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalBookings > 0
                  ? Math.round((bookedCount / totalBookings) * 100)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From active bookings only
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">Active companies</p>
            </CardContent>
          </Card>
        </div>
        <BookingListsAdmin />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter bookings by company, status, or search term
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by company or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCompany("all");
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
              <AlertDialog>
                <AlertDialogHeader>
                  <AlertDialogTitle></AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogTrigger>
                  <div className="bg-black text-white px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-black">
                    Add booking
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
                  <div className="max-h-[80vh] overflow-y-auto">
                    <AdminBookingForm />
                  </div>
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <CardDescription>
              Manage all bookings across your companies
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-0 md:pb-6">
            <div className="rounded-md border pb-4 md:pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No bookings found matching your company
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          {booking.company.name}
                        </TableCell>
                        <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                        <TableCell>
                          {booking.startTime} - {booking.endTime}
                        </TableCell>
                        <TableCell className="font-medium">
                          {booking.user.firstName} {booking.user.lastName}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(Number.parseInt(booking.price))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "booked"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              handleStatusChange(booking._id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="booked">Booked</SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
