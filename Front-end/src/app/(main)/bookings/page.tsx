"use client";

import { BookingDashboard } from "@/components/booking-dashboard";
import { AuthGuard } from "@/components/AuthGuard";

export default function Recommendation() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        <div className="pt-[50px]">
          <BookingDashboard />
        </div>
      </div>
    </AuthGuard>
  );
}
