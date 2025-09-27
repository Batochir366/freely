"use client";

import gsap from "gsap";

import { useEffect, useState, useCallback } from "react";
import ReviewsPage from "./ReviewPage";
import { CompanyName } from "./CompanyName";
import { CarouselImage } from "./CarouselImage";
import { MapInfo } from "./MapInfo";
import { About } from "./About";
import { BookingDate } from "@/app/admin/company/components/BookingDate";
import axiosInstance from "@/utils/axios";
import { useParams } from "next/navigation";

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
  socialMedia: [
    {
      Facebook: string;
      instagram: string;
      website: string;
    }
  ];
  images: string[];
  companyLogo: string;
  pricing: number;
}

export const CompanyDetail = () => {
  const [data, setData] = useState<Company>();
  useEffect(() => {
    gsap.fromTo(
      ".box",
      { x: -500, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5 }
    );
  }, []);
  const { id } = useParams();

  const getCompanyId = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/company/get-company/${id}`);
      setData(res.data.company);
    } catch (error) {
      console.log(error);
    }
  }, [id, setData]);

  useEffect(() => {
    getCompanyId();
  }, [getCompanyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="pt-[50px]">
        <CompanyName avatarURL={data?.companyLogo} name={data?.name} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CarouselImage images={data?.images || null} />
          <About description={data?.description} />
          <ReviewsPage />
          <BookingDate price={data?.pricing} />
        </div>

        <div className="space-y-4">
          {data?.location?.[0] && (
            <MapInfo
              position={data.location[0].coordinate}
              facebook={data.socialMedia[0].Facebook}
              instagram={data.socialMedia[0].instagram}
              website={data.socialMedia[0].website}
              address={data.location[0].address}
              number={data.phoneNumber}
            />
          )}
        </div>
      </div>
    </div>
  );
};
