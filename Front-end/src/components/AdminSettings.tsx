"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, Plus, Save, Trash, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
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

  const fetchCompanyData = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/get-company/${params.id}`
      );
      setData(response.data.company);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const [showPreview, setShowPreview] = useState(false);

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

  const removeImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateCompanyData = async () => {
    try {
      await axiosInstance.put(`/company/update-company/${params.id}`, data);
    } catch (error) {
      console.error("Error updating company data:", error);
    }
  };

  const handleSave = () => {
    updateCompanyData();
    router.push(`/admin/dashboard`);
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Preview</h1>
          <Button onClick={() => setShowPreview(false)}>Back to Edit</Button>
        </div>

        {/* Simple Preview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={data.companyLogo || "/placeholder.svg"}
                alt="Logo"
                className="w-16 h-16 rounded-full object-cover"
                width={64}
                height={64}
              />
              <h2 className="text-3xl font-bold">{data.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img || "/placeholder.svg"}
                      alt={`Image ${i + 1}`}
                      className="w-full h-24 object-cover rounded"
                      width={400}
                      height={256}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact Info</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Address:</strong> {data.location[0].address}
                  </p>
                  <p>
                    <strong>Website:</strong> {data.socialMedia[0].website}
                  </p>
                  <p>
                    <strong>Facebook:</strong> {data.socialMedia[0].Facebook}
                  </p>
                  <p>
                    <strong>Instagram:</strong> {data.socialMedia[0].instagram}
                  </p>
                  <p>
                    <strong>Phone:</strong> {data.phoneNumber}
                  </p>
                  <p>
                    <strong>Pricing:</strong> {data.pricing}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Company Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button className="bg-red-500" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                {data?.companyLogo && (
                  <Image
                    src={data?.companyLogo || "/placeholder.svg"}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-full object-cover border"
                    width={64}
                    height={64}
                  />
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

            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={data?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Images
              <Button size="sm" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {image && (
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                    width={80}
                    height={80}
                  />
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
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={data.location[0].address || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Enter address"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={data?.socialMedia[0].website || ""}
                onChange={(e) => handleWebsiteChange(e.target.value)}
                placeholder="Enter website"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={data?.socialMedia[0].Facebook || ""}
                  onChange={(e) => handleFacebookChange(e.target.value)}
                  placeholder="Enter Facebook handle"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={data?.socialMedia[0].instagram || ""}
                  onChange={(e) => handleInstagramChange(e.target.value)}
                  placeholder="Enter Instagram handle"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                value={data?.pricing || ""}
                onChange={(e) => handleInputChange("pricing", e.target.value)}
                placeholder="e.g., Starting from $50/session, $100/hour, Free consultation"
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter company description"
              rows={6}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
