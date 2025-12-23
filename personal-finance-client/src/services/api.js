import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001/api" });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the server returns a 401 Unauthorized, clear the token and redirect to login
      localStorage.removeItem('token'); // Clear the token from local storage
      window.location.href = "/login"; // Redirect to the login page
    }
    return Promise.reject(error); // Reject other errors
  }
);

export default API;
