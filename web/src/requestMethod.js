import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

makeRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token directly, not from userInfo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await makeRequest({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
