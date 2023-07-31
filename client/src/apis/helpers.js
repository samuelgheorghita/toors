import axios from "axios";

import { baseURL } from "./globalApi";

// Default request (pre-built)
export const customFetch = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

customFetch.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("aToken");
    if (token) {
      config.headers["Authorization"] = ` bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
customFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { aToken, rToken } = await refreshToken();

      localStorage.setItem("aToken", aToken);
      localStorage.setItem("rToken", rToken);

      // Re-doing the request
      customFetch.defaults.headers.common["Authorization"] = `Bearer ${aToken}`;
      return customFetch(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const refreshToken = async () => {
  const rToken = localStorage.getItem("rToken");

  const response = await axios.get(`${baseURL}/auth/refresh-token`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${rToken}`,
    },
  });

  return await response.data;
};
