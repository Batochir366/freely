import axios from "axios";
const http = "http://localhost:8000";
const https = "https://freely-backend-lztj.onrender.com";
const axiosInstance = axios.create({
  baseURL: https,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication removed - no token required

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error("Unauthorized access. Please login again.");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
