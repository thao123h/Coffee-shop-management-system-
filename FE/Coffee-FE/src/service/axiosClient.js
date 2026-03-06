import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // "Bearer xxx"
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;