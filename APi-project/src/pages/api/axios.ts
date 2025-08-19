import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com", // ✅ must be exact
  headers: { "Content-Type": "application/json" },
});

export default api;
