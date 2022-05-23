import axios from "axios";

export const http = axios.create({
  baseURL: "http://api.eangkot.test/",
  timeout: 5000,
});
