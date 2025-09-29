"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, ChevronLeft, X } from "lucide-react";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { formSchema, step2formSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Step2 } from "./Step2";
import { Step1 } from "./Step1";
import {
  uploadImageToCloudinary,
  uploadToCloudinary,
} from "../utils/imageUpload";
import axiosInstance from "@/utils/axios";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Dynamic import to prevent SSR issues with Leaflet
const MapComponent = dynamic(
  () => import("./MapComponent").then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
  }
);

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
  pricing: number;
}

// MarkerIcon moved to MapComponent

type CompanyInfoType = z.infer<typeof formSchema> &
  z.infer<typeof step2formSchema>;

export const Map = () => {
  const { user } = useAuth();
  const [clicked, setClicked] = useState<LatLngTuple | null>(null);
  const [address, setAddress] = useState("");

  const [value, setValue] = useState<
    Partial<z.infer<typeof formSchema>> &
      Partial<z.infer<typeof step2formSchema>>
  >({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [profileReview, setProfileReview] = useState<string>("");
  const [imagesReview, setImagesReview] = useState<string[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const jumpToDetail = (_id: string) => {
    router.push(`/Company/${_id}`);
  };

  // Map-related functions moved to MapComponent

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      Facebook: "",
      instagram: "",
      website: "",
      phoneNumber: "",
      companyLogo: undefined as unknown as FileList,
      pricing: "",
    },
  });

  const Step2form = useForm<z.infer<typeof step2formSchema>>({
    resolver: zodResolver(step2formSchema),
    defaultValues: {
      images: [] as unknown as File[],
      categories: [],
    },
  });

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    form.setValue("companyLogo", files, { shouldValidate: true });
    setProfileReview(URL.createObjectURL(files[0]));
  };

  const handleProfileToCloud = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadImageToCloudinary(file);
      return url;
    } catch (error) {
      console.log("err", error);
      return;
    }
  };

  const removeImage = (index: number) => {
    const updatedPreviews = [...imagesReview];
    const updatedFiles = [...selectedImages];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);

    setImagesReview(updatedPreviews);
    setSelectedImages(updatedFiles);
    Step2form.setValue("images", updatedFiles as File[]);
  };

  const handlNextStep = () => setIsNext(true);
  const handPreStep = () => setIsNext(false);

  const onnext = async (values: z.infer<typeof formSchema>) => {
    setIsloading(true);
    const { companyLogo } = values;

    const logoFile = companyLogo?.[0];
    const uploadedLogoUrl = await handleProfileToCloud(logoFile);
    setValue({ ...values, companyLogo: uploadedLogoUrl as FileList });
    setIsloading(false);
    handlNextStep();
  };

  const [myCompanies, setMyCompanies] = useState<Company[]>();

  const FetchData = useCallback(async () => {
    try {
      const res = await axiosInstance.post("/company/get-companies-by-user", {
        userId: user?._id,
      });
      setMyCompanies(res.data.companies);
    } catch (error) {
      console.log("Error fetching companies:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    FetchData();
  }, [FetchData]);

  const onSubmit = async (values: z.infer<typeof step2formSchema>) => {
    setIsloading(true);
    const imageUrls = await uploadToCloudinary(selectedImages);

    const updatedValues = {
      ...values,
      images: imageUrls,
      location: {
        address: address,
        coordinate: clicked,
      },
    };

    const finalData: CompanyInfoType = {
      ...(value as z.infer<typeof formSchema>),
      ...updatedValues,
    };

    setValue(finalData);

    await axiosInstance.post("/company/create-company", {
      name: finalData.name,
      description: finalData.description,
      location: {
        address: address,
        coordinate: clicked,
      },
      phoneNumber: finalData.phoneNumber,
      categoryIds: finalData.categories,
      socialMedia: {
        Facebook: finalData.Facebook,
        instagram: finalData.instagram,
        website: finalData.website,
      },
      images: finalData.images,
      companyLogo: finalData.companyLogo,
      pricing: finalData.pricing,
      userId: user?._id, // Add user ID to the request
    });

    setIsloading(false);
    toast("company has been created.");
    setOpen(false);
    FetchData();
  };

  return (
    <div className="w-full h-screen flex">
      <Toaster />
      <MapComponent
        clicked={clicked}
        setClicked={setClicked}
        address={address}
        setAddress={setAddress}
        myCompanies={myCompanies}
        jumpToDetail={jumpToDetail}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <div className="p-[3px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                continue
              </div>
            </div>
          </DialogTrigger>
          <DialogContent
            className={`flex flex-col size-fit w-[95vw] max-w-[466px] min-w-[320px] max-h-[90vh] overflow-y-auto backdrop-blur-lg bg-[#111827]/30 `}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogTitle className="text-lg sm:text-[24px] text-[#e3e8ffe6]">
              Complete your profile page
            </DialogTitle>
            <>
              {isNext ? (
                <div className="w-full">
                  <Form {...Step2form}>
                    <form
                      onSubmit={Step2form.handleSubmit(onSubmit)}
                      className="w-full"
                    >
                      <div className={` ${isLoading ? "blur-xs" : null}`}>
                        <div className=" flex flex-col gap-5">
                          <FormField
                            control={Step2form.control}
                            name="images"
                            render={({ field }) => (
                              <FormItem className="flex-col flex items-start pb-[20px]">
                                <FormLabel className="text-[#e3e8ffe6] ">
                                  Add detail images 10/
                                  {imagesReview.length}
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col items-center justify-center gap-2 w-full">
                                    <div className="flex gap-3 size-fit justify-center w-full">
                                      {imagesReview.length === 0 ? (
                                        <div className="flex justify-center items-center border-2 border-[#E4E4E7] border-dashed w-full h-[200px] md:h-[250px] text-[14px] rounded-md mx-auto">
                                          Add images, limit is 10 🤔
                                        </div>
                                      ) : (
                                        <div className="relative w-full mx-auto">
                                          <Carousel className="w-full">
                                            <CarouselContent className="w-full ml-0">
                                              {imagesReview.map(
                                                (el: string, index: number) => (
                                                  <CarouselItem
                                                    key={index}
                                                    className="pl-0"
                                                  >
                                                    <div className="relative">
                                                      <Image
                                                        className="h-[200px] md:h-[250px] w-full rounded-md object-cover"
                                                        src={el}
                                                        alt={`preview-${index}`}
                                                        width={800}
                                                        height={250}
                                                      />
                                                      <button
                                                        onClick={() =>
                                                          removeImage(index)
                                                        }
                                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-colors"
                                                      >
                                                        <X className="w-4 h-4 text-red-500" />
                                                      </button>
                                                    </div>
                                                  </CarouselItem>
                                                )
                                              )}
                                            </CarouselContent>
                                            <CarouselPrevious
                                              className="left-2"
                                              type="button"
                                            />
                                            <CarouselNext
                                              className="right-2"
                                              type="button"
                                            />
                                          </Carousel>
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      className={`flex flex-col sm:flex-row items-center justify-end gap-4 w-full ${
                                        imagesReview.length === 10 && "hidden"
                                      }`}
                                    >
                                      <FormMessage />
                                      <div className="relative">
                                        <button className="inline-flex h-8 md:h-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 md:px-4 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sm md:text-base">
                                          Add image
                                        </button>
                                        <Input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          className="opacity-0 w-full h-full absolute top-0 left-0 z-20 cursor-pointer text-[#e3e8ffe6]"
                                          onChange={(e) => {
                                            const files = Array.from(
                                              e.target.files || []
                                            ).slice(0, 10);

                                            const fileURLs = files.map((file) =>
                                              URL.createObjectURL(file)
                                            );
                                            setImagesReview((prev) => [
                                              ...prev,
                                              ...fileURLs,
                                            ]);
                                            setSelectedImages((prev) => [
                                              ...prev,
                                              ...files,
                                            ]);
                                            Step2form.setValue("images", [
                                              ...selectedImages,
                                              ...files,
                                            ]);
                                            field.onChange([
                                              ...selectedImages,
                                              ...files,
                                            ]);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <Step2 control={Step2form.control} name="categories" />
                      </div>
                    </form>
                  </Form>
                  <div className=" w-full justify-between flex pt-5">
                    <button
                      onClick={() => handPreStep()}
                      disabled={isLoading}
                      className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft />
                    </button>

                    <button
                      onClick={() => Step2form.handleSubmit(onSubmit)()}
                      disabled={isLoading}
                      className={`inline-flex h-12 animate-shimmer ${
                        isLoading ? "animate-pulse" : null
                      } items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? "submitting" : "submit"}
                    </button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onnext)} className="w-full">
                    <div className={` ${isLoading ? "blur-xs" : null}`}>
                      <FormField
                        control={form.control}
                        name="companyLogo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start w-full pb-[20px]">
                            <FormLabel className="text-[#e3e8ffe6]">
                              Company Logo
                            </FormLabel>
                            <FormControl>
                              <div className="relative flex justify-center items-center size-[160px]">
                                <div className="flex justify-center items-center border-2 border-[#E4E4E7] border-dashed size-[160px] rounded-full absolute z-20">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="rounded-full opacity-0 size-[160px] cursor-pointer"
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (!files || files.length === 0) return;

                                      const dataTransfer = new DataTransfer();
                                      dataTransfer.items.add(files[0]);

                                      e.target.files = dataTransfer.files;

                                      field.onChange(dataTransfer.files);
                                      handleProfileImage(e);
                                    }}
                                  />
                                </div>
                                <Camera
                                  className={`z-10 text-[#e3e8ffe6]/50 ${
                                    profileReview && "hidden"
                                  }`}
                                />
                                {profileReview && (
                                  <Image
                                    className="size-[160px] absolute z-10 rounded-full object-cover"
                                    src={profileReview}
                                    alt="preview"
                                    width={160}
                                    height={160}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Step1 control={form.control} />
                    </div>

                    <div className=" flex pt-5">
                      <Button
                        className={` ${
                          isLoading ? "animate-pulse blur-none" : null
                        } inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-[#e3e8ffe6] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full`}
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "please wait" : "continue"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </>
          </DialogContent>
        </Dialog>
      </MapComponent>
    </div>
  );
};
