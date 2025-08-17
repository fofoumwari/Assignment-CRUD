import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

// Interceptor for errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
