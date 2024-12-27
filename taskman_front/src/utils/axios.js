import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  baseURL: "https://x7z6fp85-8080.uks1.devtunnels.ms/api",
  //https://x7z6fp85-8080.uks1.devtunnels.ms/
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      console.error("Unauthorized access:", error);
      // TODO: Token expiration here
    }
    return Promise.reject(error);
  }
);

export default api;
