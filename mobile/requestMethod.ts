import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for the base query
interface BaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: any;
  params?: any;
}
interface BaseQueryApi {
  baseUrl?: string;
}
interface BaseQueryError {
  status?: number;
  data: any;
}
interface BaseQueryResult<T = any> {
  data?: T;
  error?: BaseQueryError;
}

const BASE_URL = "http://192.168.1.3:8080/api/";

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor with AsyncStorage instead of localStorage
makeRequest.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error reading token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({ baseUrl = "" }: BaseQueryApi = {}) =>
  async ({
    url,
    method,
    data,
    params,
  }: BaseQueryArgs): Promise<BaseQueryResult> => {
    try {
      const result = await makeRequest({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
