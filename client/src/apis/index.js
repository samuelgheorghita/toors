import axios from "axios";
import { baseURL } from "./globalApi";
import { customFetch } from "./helpers";

// Auth apis ----------------------------------------------------------
export const postUser = async (registrationData) => {
  const response = await axios.post(`${baseURL}/auth/signup`, registrationData);
  return await response.data;
};

export const loginUserApi = async (loginData) => {
  const response = await axios.post(`${baseURL}/auth/login`, loginData, { withCredentials: true });
  return await response.data;
};

export const logout = async () => {
  return await customFetch.get(`/auth/logout`, { withCredentials: true });
};

export const verifyLogin = async () => {
  return await customFetch.get(`/auth/verify-login`);
};

// Users apis ----------------------------------------------------------
export const getUserByUsername = async (username) => {
  const response = await customFetch.get(`/users/user-info?username=${username}`);
  return await response.data;
};

export const getAuthorByUsername = async (username) => {
  const response = await axios.get(`${baseURL}/users/author-info?username=${username}`);
  return await response.data;
};

export const toggleFavorite = async (tourIdObj) => {
  return await customFetch.put(`/users/toggle-favorite`, tourIdObj);
};

export const getFavorites = async (params) => {
  const response = await customFetch.get(`/users/favorites${params}`);
  return await response.data;
};

export const getMyTours = async (params) => {
  const response = await customFetch.get(`/users/my-tours${params}`);
  return response.data;
};

// Tours apis ----------------------------------------------------------------------
export const getTours = async (queryString) => {
  const response = await axios.get(`${baseURL}/tours${queryString}`, { withCredentials: true });
  return await response.data;
};

export const getSingleTour = async (id) => {
  const response = await axios.get(`${baseURL}/tours/single-tour?id=${id}`, { withCredentials: true });
  return await response.data;
};

export const postTour = async (form) => {
  const response = await customFetch.post(`/tours/multiple`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateTour = async (form, id) => {
  const response = await customFetch.put(`/tours/update?id=${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteTour = async (id) => {
  const response = await customFetch.delete(`/tours?id=${id}`, { withCredentials: true });
  return response;
};
