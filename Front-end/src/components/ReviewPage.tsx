"use client";

import type React from "react";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axiosInstance from "@/utils/axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card } from "./ui/card";

interface SuggestionFormData {
  name: string;

  suggestion: string;
  rating: number;
}

interface Review {
  _id: string;
  name: string;
  comment: string;
  starCount: number;
  createdAt: string;
}

export default function ReviewsPage() {
  const { userId } = useAuth();
  const params = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReview = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/review/reviews/${params.id}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.log(error);
    }
  }, [params.id, setReviews]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const [formData, setFormData] = useState<SuggestionFormData>({
    name: "",
    suggestion: "",
    rating: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    if (!reviews.length)
      return { overallRating: 0, totalRatings: 0, ratingsData: [] };

    const totalStars = reviews.reduce(
      (sum: number, review) => sum + review.starCount,
      0
    );
    const overallRating = Number((totalStars / reviews.length).toFixed(1));
    const totalRatings = reviews.length;

    const ratingCounts = Array(5).fill(0);
    reviews.forEach((review) => {
      ratingCounts[review.starCount - 1]++;
    });

    const ratingsData = ratingCounts.map((count: number, index: number) => {
      const stars = index + 1;
      const percentage = Number(((count / totalRatings) * 100).toFixed(1));
      return { stars, count, percentage };
    });

    return { overallRating, totalRatings, ratingsData };
  }, [reviews]);

  const { overallRating, totalRatings, ratingsData } = stats;

  const renderStars = (
    rating: number,
    interactive = false
  ): React.ReactNode[] => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 ${
          index < rating
            ? "fill-yellow-500 text-yellow-500"
            : "fill-gray-300 text-gray-300"
        } ${
          interactive
            ? "cursor-pointer hover:scale-110 transition-transform"
            : ""
        }`}
        onClick={interactive ? () => handleRatingChange(index + 1) : undefined}
      />
    ));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.suggestion.trim()) {
      errors.suggestion = "Suggestion is required";
    } else if (formData.suggestion.length < 10) {
      errors.suggestion = "Suggestion must be at least 10 characters";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      if (!userId) {
        window.location.href = "/sign-in";
        return;
      }

      const response = await axiosInstance.post("/review/create-review", {
        companyId: params.id,
        name: formData.name.trim(),
        comment: formData.suggestion.trim(),
        starCount: formData.rating,
      });

      if (response.data.success) {
        fetchReview();

        setIsSubmitted(true);
        setFormErrors({});
        setFormData({
          name: "",
          suggestion: "",
          rating: 0,
        });

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error("Failed to create review");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-cover">
      <div className="w-full mx-auto">
        <div className="rounded-lg">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-4 border-b">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="suggest">Make a Suggestion</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left side - Overall Rating */}
                    <div className="flex-shrink-0">
                      <div className="text-7xl font-bold text-white mb-2">
                        {overallRating.toFixed(1)}
                      </div>

                      <div className="flex gap-1 mb-3">
                        {renderStars(Math.floor(overallRating))}
                      </div>

                      <div className="text-white/70 font-medium">
                        {totalRatings}+ ratings
                      </div>
                    </div>

                    {/* Right side - Rating Distribution */}
                    <div className="flex-1 w-full max-w-md">
                      <div className="space-y-3">
                        {ratingsData.map((rating) => (
                          <div
                            key={rating.stars}
                            className="flex items-center gap-3"
                          >
                            <span className="text-sm font-medium text-white w-2">
                              {rating.stars}
                            </span>

                            <div className="flex-1">
                              <Progress
                                value={rating.percentage}
                                className="h-3 bg-gray-200"
                                style={
                                  {
                                    "--progress-background":
                                      rating.count > 0 ? "#3b82f6" : "#e5e7eb",
                                  } as React.CSSProperties
                                }
                              />
                            </div>

                            <span className="text-xs text-white w-8 text-right">
                              {rating.count > 0 ? rating.count : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Reviews Preview */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Recent Reviews
                    </h3>

                    {reviews.length === 0 ? (
                      <div className="text-white/20 w-full border rounded-lg h-[100px] flex items-center justify-center text-center">
                        No reviews on this company
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4 mb-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {renderStars(review.starCount)}
                            </div>
                            <span className="text-sm text-white/70">
                              {`${Math.ceil(
                                (new Date().getTime() -
                                  new Date(review.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} days ago`}
                            </span>
                          </div>
                          <p className="text-white">{review.comment}</p>
                          <div className="text-sm text-white/50 mt-2">
                            - {review.name}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="suggest">
                  <div className=" rounded-lg p-6 border bg-white/10 backdrop-blur-sm border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-white">
                      Submit Your Suggestion or Request
                    </h2>

                    {isSubmitted ? (
                      <Alert className="bg-green-50 border-green-200 mb-4">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Thank you for your suggestion! We&apos;ll review it
                          shortly.
                        </AlertDescription>
                      </Alert>
                    ) : null}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white/70">
                            Your Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={
                              formErrors.name ? "border-red-500" : "text-white"
                            }
                          />
                          {formErrors.name && (
                            <p className="text-red-500 text-sm">
                              {formErrors.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suggestion" className="text-white/70">
                          Your Suggestion or Request
                        </Label>
                        <Textarea
                          id="suggestion"
                          name="suggestion"
                          placeholder="Share your suggestion or request for the bootcamp..."
                          rows={5}
                          value={formData.suggestion}
                          onChange={handleInputChange}
                          className={
                            formErrors.suggestion
                              ? "border-red-500"
                              : "text-white"
                          }
                        />
                        {formErrors.suggestion && (
                          <p className="text-red-500 text-sm">
                            {formErrors.suggestion}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/70">
                          Rate Your Experience (Optional)
                        </Label>
                        <div className="flex gap-1">
                          {renderStars(formData.rating, true)}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Suggestion
                          </>
                        )}
                      </Button>
                    </form>
                  </div>

                  <div className="mt-6 p-4 rounded-lg border bg-white/10 backdrop-blur-sm border-white/20">
                    <h3 className="text-lg font-medium text-white/70 mb-2">
                      Why Submit a Suggestion?
                    </h3>
                    <p className="text-white/70">
                      Your feedback helps us improve the bootcamp experience for
                      future students. We review all suggestions and implement
                      changes based on your valuable input.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
