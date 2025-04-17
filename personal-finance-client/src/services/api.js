import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001/api" });

// for each request, add the token to the headers
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

export default API;
