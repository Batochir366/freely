"use client";

import type React from "react";

import { useEffect, useState, useCallback } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/hooks/use-toast";

const timeSlots = [
  "08:00",

  "09:00",

  "10:00",

  "11:00",

  "12:00",

  "13:00",

  "14:00",

  "15:00",

  "16:00",

  "17:00",

  "18:00",
];

interface BookingFormData {
  userEmail: string;
  company: string;
  bookingDate: Date | undefined;
  startTime: string;
  endTime: string;
  price: string;
  status: string;
}

interface Company {
  _id: string;
  name: string;
}

export default function AdminBookingForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookingFormData>({
    userEmail: "",
    company: "",
    bookingDate: new Date(),
    startTime: "",
    endTime: "",
    price: "",
    status: "booked",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    fetchCompanies();
  }, [fetchCompanies]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); // Clear any previous error messages

    if (
      !formData.userEmail ||
      !formData.company ||
      !formData.bookingDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.price
    ) {
      setErrorMessage("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setErrorMessage("End time must be after start time");
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedDate = format(formData.bookingDate, "yyyy-MM-dd");

      const response = await axiosInstance.post("/booking/create-booking", {
        userEmail: formData.userEmail,
        companyId: formData.company,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        price: formData.price,
        bookingDate: formattedDate,
      });

      // Check if the response indicates success
      if (response.data.success) {
        // Show success toast
        toast({
          title: "Booking Created Successfully!",
          description: "The booking has been created and added to the system.",
        });

        // Reset form
        setFormData({
          userEmail: "",
          company: "",
          bookingDate: undefined,
          startTime: "",
          endTime: "",
          price: "",
          status: "booked",
        });

        // Close modal by refreshing the page or triggering a close event
        window.location.reload();
      } else {
        // Show error message in modal
        setErrorMessage(
          response.data.message || "There was an error creating the booking."
        );
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrorMessage(
        "There was an error creating the booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-4 w-4" />
          Create New Booking
        </CardTitle>
        <CardDescription className="text-sm">
          Create a new booking by entering the user&apos;s email address,
          company, and time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">User Email *</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="Enter user email"
              value={formData.userEmail}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userEmail: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select
              value={formData.company}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, company: value || "" }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Booking Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.bookingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.bookingDate
                    ? format(formData.bookingDate, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.bookingDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, bookingDate: date }))
                  }
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, startTime: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, endTime: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      disabled={time <= formData.startTime}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price (e.g., 75000)"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Booking..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
