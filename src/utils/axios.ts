import axios from "axios";
import { keysToCamel, keysToSnake } from "./bodySerializer";

export const http = axios.create({
  baseURL: "http://api.eangkot.test/",
  timeout: 5000,
});

const reqInterceptor = http.interceptors.request.use((req) => {
  const toApi = req.baseURL.includes("api.eangkot.test");

  if (toApi) {
    req.withCredentials = true;
    req.data = keysToSnake(req.data);
  }

  return req;
});

const resInterceptor = http.interceptors.response.use((res) => {
  res.data = keysToCamel(res.data);

  return res;
});
