"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Search,
  MoreHorizontal,
  Trash2,
  Eye,
  Building2,
  TrendingUp,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";

interface User {
  _id: string;
  clerkId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  photo: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Company {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  company: Company;
  user: User;
  name: string;
  starCount: number;
  comment: string;
  createdAt: string;
  __v: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating}.0</span>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function getRatingColor(rating: number) {
  if (rating >= 4) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (rating >= 3) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

function getCompanyColor(companyId: string) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-slate-500",
  ];

  // Generate consistent color based on company ID
  const hash = companyId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

function CompanyReviewsTable({
  company,
  reviews,
  searchTerm,
  setSearchTerm,
}: {
  company: Company;
  reviews: Review[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.starCount, 0) /
        reviews.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 ${getCompanyColor(
                company._id
              )} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {company.name}
              </h2>
              <p className="text-gray-600 font-medium">
                Company ID: {company._id.slice(-8)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {reviews.filter((r) => r.starCount >= 4).length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Positive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search reviews by customer name or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-500">
                This company hasnt received any reviews yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 bg-gray-50/30">
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Rating
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Review
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 w-[70px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review, index) => (
                    <TableRow
                      key={review._id}
                      className={`border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-gray-100">
                            <AvatarImage
                              src={review.user.photo || "/placeholder.svg"}
                              alt={`${review.user.firstName} ${review.user.lastName}`}
                            />
                            <AvatarFallback className="text-sm font-medium bg-gray-100 text-gray-700">
                              {getInitials(
                                review.user.firstName,
                                review.user.lastName
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {review.user.firstName} {review.user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{review.user.userName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <StarRating rating={review.starCount} />
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium border ${getRatingColor(
                              review.starCount
                            )}`}
                          >
                            {review.starCount} star
                            {review.starCount !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 max-w-md">
                        <div className="space-y-1">
                          <p
                            className="text-gray-900 leading-relaxed"
                            title={review.comment}
                          >
                            {review.comment.length > 120
                              ? `${review.comment.slice(0, 120)}...`
                              : review.comment}
                          </p>
                          {review.comment.length > 120 && (
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              Read more
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-gray-700">
                          {formatDate(review.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredReviews.length === 0 && reviews.length > 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No matching reviews
              </h3>
              <p className="text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminReviewsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          "/review/user-company-reviews"
        );

        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          console.error("API returned success:false");
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error details:", {
          error: err,
        });
        setError("Error fetching reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const companies = reviews.reduce((acc, review) => {
    const existingCompany = acc.find((c) => c._id === review.company._id);
    if (!existingCompany) {
      acc.push(review.company);
    }
    return acc;
  }, [] as Company[]);

  const totalReviews = reviews.length;
  const overallAverageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.starCount, 0) /
        reviews.length
      : 0;

  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]._id);
    }
  }, [companies, selectedCompany]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Loading Reviews
          </h3>
          <p className="text-gray-500">
            Please wait while we fetch your company reviews...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Reviews Found
          </h3>
          <p className="text-gray-500">
            You dont have any reviews yet. Start collecting customer feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-scroll scrollbar-hide">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Reviews Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Monitor and manage customer feedback across all companies
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  {companies.length}
                </span>
                <span className="text-blue-700">Companies</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">
                  {totalReviews}
                </span>
                <span className="text-green-700">Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                <span className="font-semibold text-amber-900">
                  {overallAverageRating.toFixed(1)}
                </span>
                <span className="text-amber-700">Average</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by company name..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-md text-base focus:border-gray-400 focus:ring-gray-400"
              >
                {filteredCompanies.map((company) => {
                  const companyReviews = reviews.filter(
                    (review) => review.company._id === company._id
                  );
                  return (
                    <option key={company._id} value={company._id}>
                      {company.name} ({companyReviews.length} reviews)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filteredCompanies.map((company) => {
                const companyReviews = reviews.filter(
                  (review) => review.company._id === company._id
                );
                const avgRating =
                  companyReviews.length > 0
                    ? companyReviews.reduce(
                        (sum, review) => sum + review.starCount,
                        0
                      ) / companyReviews.length
                    : 0;

                return (
                  <button
                    key={company._id}
                    onClick={() => setSelectedCompany(company._id)}
                    className={`flex-shrink-0 flex items-center gap-3 p-4 rounded-lg border-2 transition-all min-w-[200px] ${
                      selectedCompany === company._id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 ${getCompanyColor(
                        company._id
                      )} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-semibold text-sm ${
                          selectedCompany === company._id
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        ID: {company._id.slice(-8)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {companyReviews.length}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium">
                            {avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Company Reviews */}
        {(() => {
          const company = companies.find((c) => c._id === selectedCompany);
          const companyReviews = reviews.filter(
            (review) => review.company._id === selectedCompany
          );

          if (!company) return null;

          return (
            <CompanyReviewsTable
              company={company}
              reviews={companyReviews}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          );
        })()}
      </div>
    </div>
  );
}
