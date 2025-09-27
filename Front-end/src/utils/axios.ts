import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://teamproject-mongodb.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const tokenRes = await fetch("/api/webhooks/clerk");
        const { token } = await tokenRes.json();

        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Token fetch failed:", err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
