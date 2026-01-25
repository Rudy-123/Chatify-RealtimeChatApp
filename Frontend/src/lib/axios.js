import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "httplocalhost3000/api" : "/api",
  withCredentials: true,
});
