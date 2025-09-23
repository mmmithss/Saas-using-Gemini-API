import axios from "axios";

export const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    : "/api/v1";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default axiosInstance;
