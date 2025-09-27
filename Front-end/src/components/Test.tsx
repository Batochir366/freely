"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Instagram,
} from "lucide-react";

const timeSlots = [
  "02:00-03:00",
  "03:00-04:00",
  "04:00-05:00",
  "05:00-06:00",
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

const weekDays = [
  { day: "Thursday", date: "Jun 20", isToday: false },
  { day: "Friday", date: "Jun 21", isToday: false },
  { day: "Saturday", date: "Jun 22", isToday: true },
  { day: "Sunday", date: "Jun 23", isToday: false },
  { day: "Monday", date: "Jun 24", isToday: false },
  { day: "Tuesday", date: "Jun 25", isToday: false },
  { day: "Wednesday", date: "Jun 26", isToday: false },
];

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "suggestion">(
    "reviews"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 3);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + 3) % 3);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">shangrila</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-white/80 hover:text-white transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-white/80 hover:text-white transition-colors"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("booking")}
                className="text-white/80 hover:text-white transition-colors"
              >
                Booking
              </button>
            </nav>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <section id="gallery">
              <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/80 to-purple-600/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🏙️</div>
                        <h2 className="text-2xl font-bold text-white">
                          Shangrila Experience
                        </h2>
                        <p className="text-white/80 mt-2">
                          Premium venue in the heart of the city
                        </p>
                      </div>
                    </div>

                    {/* Navigation arrows */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    1 of 3
                  </div>
                </div>
              </Card>
            </section>

            {/* About This Place */}
            <section id="about">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    ABOUT THIS PLACE
                  </h2>
                  <p className="text-white/80 text-lg">shangrila venue</p>
                </div>
              </Card>
            </section>

            {/* Reviews Section */}
            <section id="reviews">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-6">
                  <div className="flex space-x-8 border-b border-white/20 mb-6">
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`pb-4 px-1 font-medium transition-colors ${
                        activeTab === "reviews"
                          ? "text-purple-400 border-b-2 border-purple-400"
                          : "text-white/60 hover:text-white/80"
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab("suggestion")}
                      className={`pb-4 px-1 font-medium transition-colors ${
                        activeTab === "suggestion"
                          ? "text-purple-400 border-b-2 border-purple-400"
                          : "text-white/60 hover:text-white/80"
                      }`}
                    >
                      Make a Suggestion
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-5xl font-bold text-white">0.0</div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 text-white/30" />
                      ))}
                    </div>
                    <span className="text-white/60">No, not yet</span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Reviews
                    </h3>
                    <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                      <p className="text-white/60">
                        No reviews on this company
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Booked Time Slots */}
            <section id="booking">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Booked Time Slots
                    </h2>
                  </div>
                  <p className="text-white/60 mb-6">
                    No bookings yet. Click on a time slot to book it.
                  </p>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        Ulaanbaatar
                      </h3>
                      <Button
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 hover:bg-white/10"
                      >
                        Next week →
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Header Row */}
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        <div className="text-sm font-medium text-white/60 p-2"></div>
                        {weekDays.map((day, index) => (
                          <div key={index} className="text-center p-2">
                            <div
                              className={`text-sm font-medium ${
                                day.isToday ? "text-red-400" : "text-white"
                              }`}
                            >
                              {day.day}
                            </div>
                            <div
                              className={`text-sm ${
                                day.isToday ? "text-red-400" : "text-white/60"
                              }`}
                            >
                              {day.date}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-2">
                        {timeSlots.map((timeSlot, rowIndex) => (
                          <div
                            key={rowIndex}
                            className="grid grid-cols-8 gap-2"
                          >
                            <div className="text-sm text-white/60 p-2 font-mono">
                              {timeSlot}
                            </div>
                            {weekDays.map((_, colIndex) => (
                              <Button
                                key={colIndex}
                                variant="outline"
                                size="sm"
                                className="h-10 text-xs font-medium bg-white/10 border-white/20 text-white hover:bg-purple-500/30 hover:border-purple-400 transition-all duration-200"
                              >
                                75,000 ₸
                              </Button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-sm text-white space-y-2">
                    <div className="font-semibold text-purple-400">
                      📍 Location Details
                    </div>
                    <div>Ulaanbaatar, Mongolia</div>
                    <div className="text-white/60">
                      Coordinates: 47.9077, 106.8832
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* More Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  MORE INFO
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-white/80">Ulaanbaatar, Mongolia</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                      https://test.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                      https://www.facebook.com/
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                      https://www.instagram.com/account/1/1050404739994/
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span className="text-white/80">(+976) 99334577</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">
                      Price per hour
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-semibold bg-purple-500/20 text-purple-300 border-purple-400/30"
                    >
                      75,000 ₸
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">
                      Available slots
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400/30 bg-green-500/10"
                    >
                      140 slots
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-white/30" />
                      <span className="text-sm text-white/60">
                        No reviews yet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
