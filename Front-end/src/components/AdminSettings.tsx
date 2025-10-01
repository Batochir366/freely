"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, Plus, Save, Trash, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/hooks/use-toast";
import { Toaster } from "./toaster";
import {
  uploadImageToCloudinary,
  uploadToCloudinary,
} from "@/app/admin/company/utils/imageUpload";

type CompanyData = {
  companyLogo: string;
  name: string;
  images: string[];
  location: [
    {
      address: string;
      coordinate: [number, number];
    }
  ];
  socialMedia: [
    {
      website: string;
      Facebook: string;
      instagram: string;
    }
  ];

  phoneNumber: string;
  description: string;
  pricing: string;
};

export const AdminSettings = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [data, setData] = useState<CompanyData>({
    companyLogo: "",
    name: "",
    images: [],
    location: [
      {
        address: "",
        coordinate: [0, 0],
      },
    ],
    socialMedia: [
      {
        website: "",
        Facebook: "",
        instagram: "",
      },
    ],
    phoneNumber: "",
    description: "",
    pricing: "",
  });

  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/company/get-company/${params.id}`
      );
      setData(response.data.company);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  // Debug user authentication
  useEffect(() => {
    console.log("User authentication status:", {
      user: user,
      isAuthenticated: !!user?._id,
      userId: user?._id,
    });
  }, [user]);

  const [showPreview, setShowPreview] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      location: [
        {
          address: value,
          coordinate: prev.location[0].coordinate,
        },
      ],
    }));
  };

  const handleFacebookChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      socialMedia: [
        {
          instagram: prev.socialMedia[0].instagram,
          Facebook: value,
          website: prev.socialMedia[0].website,
        },
      ],
    }));
  };

  const handleInstagramChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      socialMedia: [
        {
          Facebook: prev.socialMedia[0].Facebook,
          website: prev.socialMedia[0].website,
          instagram: value,
        },
      ],
    }));
  };

  const handleWebsiteChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      socialMedia: [
        {
          Facebook: prev.socialMedia[0].Facebook,
          instagram: prev.socialMedia[0].instagram,
          website: value,
        },
      ],
    }));
  };

  const handleImageChange = async (index: number, value: string) => {
    const newImages = [...data.images];
    const file = new File([value], "image.jpg", { type: "image/jpeg" });
    const cloudinaryURL = await uploadToCloudinary([file]);
    newImages[index] = cloudinaryURL[0];
    setData((prev) => ({ ...prev, images: newImages }));
  };

  const addImage = async () => {
    setData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = async (index: number) => {
    try {
      const imageToRemove = data.images[index];
      console.log("Removing image at index:", index);
      console.log("Image URL to remove:", imageToRemove);
      console.log("Current images array:", data.images);

      // Remove from local state immediately for better UX
      const newImages = data.images.filter((_, i) => i !== index);
      console.log("New images array after removal:", newImages);

      setData((prev) => ({
        ...prev,
        images: newImages,
      }));

      console.log("Image removed from local state successfully");

      // Show success message
      toast({
        title: "Success",
        description:
          "Image removed successfully! Don't forget to save your changes.",
      });
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateCompanyData = async () => {
    try {
      console.log("Starting company update...");
      console.log("User:", user);
      console.log("Company ID:", params.id);
      console.log("Data to update:", data);

      // Use user ID from context or fallback to known user ID
      const userId = user?._id || "68da692b9cee9f169af9dfad";

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatePayload = {
        userId: userId,
        name: data.name,
        description: data.description,
        location: data.location,
        phoneNumber: data.phoneNumber,
        socialMedia: data.socialMedia,
        pricing: data.pricing,
        images: data.images,
        companyLogo: data.companyLogo,
      };

      console.log("Sending update request with payload:", updatePayload);
      console.log("Images being sent to backend:", data.images);
      console.log("Number of images:", data.images.length);

      const response = await axiosInstance.put(
        `/company/update-company/${params.id}`,
        updatePayload
      );

      console.log("Company updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating company data:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked!");
    console.log("isUpdating:", isUpdating);

    if (isUpdating) {
      console.log("Already updating, skipping...");
      return; // Prevent multiple submissions
    }

    console.log("Starting save process...");
    setIsUpdating(true);

    try {
      console.log("Calling updateCompanyData...");
      await updateCompanyData();

      console.log("Update successful, showing success toast...");
      // Show success toast
      toast({
        title: "Success",
        description: "Company updated successfully!",
      });

      console.log("Redirecting to dashboard...");
      router.push(`/admin/dashboard`);
    } catch (error) {
      console.log("Update failed, showing error toast...");
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      });
      console.error("Save error:", error);
    } finally {
      console.log("Setting isUpdating to false...");
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/company/delete-company/${params.id}`);
    } catch (error) {
      console.error("Error deleting company:", error);
    }

    router.push(`/admin/dashboard`);
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Company Preview
              </h1>
              <Button
                onClick={() => setShowPreview(false)}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Edit
              </Button>
            </div>
            <p className="text-gray-600 mt-2">
              This is how your company will appear to customers
            </p>
          </div>

          {/* Company Header */}
          <Card className="bg-white shadow-sm border border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <Image
                  src={data.companyLogo || "/placeholder.svg"}
                  alt="Logo"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                  width={80}
                  height={80}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {data.name}
                  </h2>
                  <p className="text-gray-600 text-lg">{data.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 text-lg">
                    Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Address:
                      </span>
                      <span className="text-gray-900">
                        {data.location[0].address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Website:
                      </span>
                      <a
                        href={data.socialMedia[0].website}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.socialMedia[0].website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Facebook:
                      </span>
                      <a
                        href={data.socialMedia[0].Facebook}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.socialMedia[0].Facebook}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Instagram:
                      </span>
                      <a
                        href={data.socialMedia[0].instagram}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.socialMedia[0].instagram}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900">{data.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Pricing:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ${data.pricing}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 text-lg">
                    About This Place
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {data.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Preview */}
          {data.images && data.images.length > 0 && (
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Company Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Company image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        width={200}
                        height={128}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Company Profile
              </h1>
              <p className="text-gray-600">
                Update your company information, images, and contact details
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Basic Information
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Essential details about your company
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="logo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Logo
                  </Label>
                  <p className="text-xs text-gray-500">
                    Upload a clear, high-quality logo for your company
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {data?.companyLogo && (
                    <div className="relative">
                      <Image
                        src={data?.companyLogo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                        width={80}
                        height={80}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const cloudinaryUrl = await uploadImageToCloudinary(
                            file
                          );
                          handleInputChange("companyLogo", cloudinaryUrl);
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name *
                </Label>
                <Input
                  id="name"
                  value={data?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your company name"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">
                  This will be displayed as the main title
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Images */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Company Images
                </div>
                <Button
                  size="sm"
                  onClick={addImage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Upload multiple images to showcase your company (up to 10
                images)
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {data?.images.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No images uploaded yet</p>
                  <Button
                    onClick={addImage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Image
                  </Button>
                </div>
              ) : (
                data?.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {image && (
                      <div className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          width={80}
                          height={80}
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              handleImageChange(index, result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => await removeImage(index)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Contact Information
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                How customers can reach and find your company
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Business Address *
                </Label>
                <Input
                  id="address"
                  value={data.location[0].address || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="Enter your business address"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">
                  This will be shown on your company profile and used for
                  location services
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-gray-700"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  value={data?.socialMedia[0].website || ""}
                  onChange={(e) => handleWebsiteChange(e.target.value)}
                  placeholder="https://your-website.com"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Your company&apos;s official website
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="facebook"
                    className="text-sm font-medium text-gray-700"
                  >
                    Facebook Page
                  </Label>
                  <Input
                    id="facebook"
                    value={data?.socialMedia[0].Facebook || ""}
                    onChange={(e) => handleFacebookChange(e.target.value)}
                    placeholder="https://facebook.com/your-page"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Your Facebook business page
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instagram"
                    className="text-sm font-medium text-gray-700"
                  >
                    Instagram Profile
                  </Label>
                  <Input
                    id="instagram"
                    value={data?.socialMedia[0].instagram || ""}
                    onChange={(e) => handleInstagramChange(e.target.value)}
                    placeholder="https://instagram.com/your-handle"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Your Instagram business account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={data?.phoneNumber || ""}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="Enter your business phone number"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Customers can call this number for inquiries
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="pricing"
                    className="text-sm font-medium text-gray-700"
                  >
                    Starting Price (USD) *
                  </Label>
                  <Input
                    id="pricing"
                    value={data?.pricing || ""}
                    onChange={(e) =>
                      handleInputChange("pricing", e.target.value)
                    }
                    placeholder="e.g., 50, 100, 150"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Your starting price for services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Description */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Company Description
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Tell customers about your company and what makes you special
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  About Your Company *
                </Label>
                <Textarea
                  id="description"
                  value={data?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your company, services, specialties, and what makes you unique. This helps customers understand what you offer..."
                  rows={6}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500">
                  Write a compelling description that helps customers understand
                  your business and services
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    </div>
  );
};
