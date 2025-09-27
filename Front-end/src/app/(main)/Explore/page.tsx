"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, Map, List } from "lucide-react";

import NavBar from "@/components/navbar";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/components/FilterByCategories";
import { useCategory } from "@/app/context/CategoryContext";
import dynamic from "next/dynamic";

const ExploreMap = dynamic(() => import("./components/ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-white">Loading map...</div>
    </div>
  ),
});
import { useLoading } from "@/app/context/LoadingContext";
import Image from "next/image";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: Array<{
    address: string;
    coordinate: [number, number];
  }>;
  phoneNumber: string;
  category: [
    {
      icon: string;
      name: string;
    }
  ];
  socialMedia: {
    Facebook: string;
    instagram: string;
    website: string;
  };
  images: string[];
  companyLogo: string;
  pricing: number;
}

export default function ExplorePage() {
  const { categories } = useCategory();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (search) {
          params.append("q", search);
        }

        selectedCategories.forEach((id) => {
          params.append("categories", id);
        });

        const res = await axiosInstance.get(
          `/company/get-companies?${params.toString()}`
        );

        setCompanies(res.data.companies || []);
      } catch (error) {
        console.error("Error fetching companies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [search, selectedCategories]);

  console.log(companies);

  const jumpToDetail = (_id: string) => {
    router.push(`/Company/${_id}`);
  };
  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className=" hidden sm:flex py-4">
          <span className="text-6xl font-bold text-white">
            Explore activities
          </span>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gray-900/80 backdrop-blur-sm border-gray-700 border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white" />
              <span className="text-white">Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search activities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-800 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Category
                </label>
                <CategoryFilter
                  categories={categories}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white flex gap-1">
              <p className="text-green-400">{companies.length}</p> activities
              found
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              className={`${
                viewMode === "list"
                  ? "bg-green-600 text-white hover:bg-green-600"
                  : " bg-white text-black hover:bg-white"
              } 
               `}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              className={`${
                viewMode === "map"
                  ? "bg-green-600 text-white hover:bg-green-600"
                  : " bg-white text-black hover:bg-white"
              } 
               `}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <div className="h-80 sm:h-196 rounded-lg overflow-hidden">
            <ExploreMap data={companies} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-gray-900/80 border-gray-700 border shadow-md"
                >
                  <div className="h-48rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : companies.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No activities found
                </h3>
                <p className="text-gray-300 text-lg">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              companies.map((company) => (
                <Card
                  onClick={() => jumpToDetail(company._id)}
                  key={company._id}
                  className="hover:shadow-lg duration-300 bg-gray-900/80 backdrop-blur-sm border-gray-700 border p-0 cursor-pointer shadow-md"
                >
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {company.images?.[0] ? (
                      <Image
                        width={407}
                        height={192}
                        src={company.images[0]}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-freely-blue/10 to-freely-emerald/10">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg text-white">
                        {company.name.slice(0, 10)}
                      </h3>
                      <div className="flex gap-2 items-center mb-2">
                        {company.category.slice(0, 3).map((value) => (
                          <Badge
                            key={value.name}
                            variant="secondary"
                            className="capitalize bg-white text-black"
                          >
                            {value.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-white/50 text-sm mb-3 line-clamp-2">
                      {company.description}
                    </p>

                    <div className="flex items-center space-x-1 mb-4">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-white/50 truncate">
                        {company.location[0]?.address}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
