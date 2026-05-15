/** @format */

import axios from "axios";

const axiosClient = axios.create({
  // You can set the base URL later when you know it
  baseURL: "http://localhost:4000",
  withCredentials: true, // Typically needed for auth cookies/sessions
});

export default axiosClient;
