import axios from "axios";

export const uploadToCloudinary = async (files: File[]) => {
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dfdpirnv5/image/upload";
  const UPLOAD_PRESET = "album1999";

  const uploadPromises = files.map((file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    return axios
      .post(CLOUDINARY_URL, formData)
      .then((res) => res.data.secure_url);
  });

  return Promise.all(uploadPromises);
};

export const uploadImageToCloudinary = async (file: File) => {
  const UPLOAD_PRESET = "album1999";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dfdpirnv5/image/upload",
      formData
    );

    const result = response.data.secure_url;
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
