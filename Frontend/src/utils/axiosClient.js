/** @format */

import axios from "axios";

const axiosClient = axios.create({
  // You can set the base URL later when you know it
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Typically needed for auth cookies/sessions
});

export default axiosClient;
