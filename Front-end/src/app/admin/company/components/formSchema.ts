import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(5, {
      message: "must be at least 5 characters.",
    })
    .max(500, { message: "too long" }),
  phoneNumber: z
    .string({ required_error: "phone number required" })
    .min(8, {
      message: "at least 8 characters.",
    })
    .max(8, {
      message: "Invalid phone number must be below 8 characters.",
    }),
  Facebook: z
    .string()
    .min(2, {
      message: "must be at least 2 characters.",
    })
    .url({ message: "Must be website url" }),
  instagram: z
    .string()
    .min(2, {
      message: "must be at least 2 characters.",
    })
    .url({ message: "Must be website url" }),
  website: z
    .string({ required_error: "url required" })
    .url({ message: "enter valid URL" }),
  pricing: z
    .string({ required_error: " number required" })
    .max(7, { message: "too long" }),
  companyLogo: z
    .custom<FileList>((value) => value instanceof FileList, {
      message: "Company logo is required",
    })
    .refine((files) => files?.length > 0, "Company logo is required")
    .refine((files) => {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      return file && allowedTypes.includes(file.type);
    }, "Only JPG, PNG, or WEBP files are allowed")
    .refine((files) => {
      const maxSize = 2 * 1024 * 1024;
      return files[0]?.size <= maxSize;
    }, "Image must be smaller than 2MB"),
});

export const step2formSchema = z.object({
  images: z
    .any()
    .refine((files) => files?.length > 0, {
      message: "Please upload at least one image.",
    })
    .refine(
      (files) =>
        files &&
        typeof files === "object" &&
        "length" in files &&
        Array.from(files).every(
          (file) =>
            file instanceof File &&
            ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      {
        message: "Only JPG, PNG, or WEBP files are allowed.",
      }
    )
    .refine((files) => files?.length <= 10, {
      message: "You can upload a maximum of 10 images.",
    }),
  categories: z.array(z.string()).min(1, "Please select at least one category"),
});
