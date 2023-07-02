import axios from "axios";
import jwt from "jwt-decode";

import { baseURL, prePath } from "./globalApi";
import { useNavigate } from "react-router-dom";

// Default request (pre-built)
const customFetch = axios.create({
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

      // Re-do the request. HOW?
      console.log("SECOND REQUEST");
      //   const response = await axios.get(`${baseURL}/users/user-info?username=${username}`, {
      //     withCredentials: true,
      //     headers: {
      //       Authorization: `Bearer ${aToken}`,
      //     },
      //   });
      //         return await response.data;

      customFetch.defaults.headers.common["Authorization"] = `Bearer ${aToken}`;
      return customFetch(originalRequest);
    }
    return Promise.reject(error);
  }
);

const preProcessRequestWithCredentials = () => {
  const aToken = localStorage.get("aToken");
  const rToken = localStorage.get("rToken");

  if (!aToken || !rToken) {
    // useNavigate()(`${prePath}/users/login`);
    return false;
  }

  return true;
};

export const getUserByUsername2 = async (username) => {
  try {
    const response = await customFetch.get(`/users/user-info?username=${username}`);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
};

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

// export const getUserByUsername2 = async (username) => {
//   const aToken = localStorage.getItem("aToken");

//   // Make request with AT
//   try {
//     console.log("FIRST REQUEST");
//     const response = await axios.get(`${baseURL}/users/user-info?username=${username}`, {
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${aToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.log("Error here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const { aToken, rToken } = await refreshToken();

//       localStorage.setItem("aToken", aToken);
//       localStorage.setItem("rToken", rToken);

//       // Re-do the request. HOW?
//       console.log("SECOND REQUEST");
//       const response = await axios.get(`${baseURL}/users/user-info?username=${username}`, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${aToken}`,
//         },
//       });
//       return await response.data;
//     }
//   }
// };
