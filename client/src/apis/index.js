import axios from "axios";
import { baseURL } from "./globalApi";
import { getUserByUsername2 } from "./helpers";

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
  const response = await axios.get(`${baseURL}/auth/logout`, { withCredentials: true });
  return response;
};

export const verifyLogin = async () => {
  getUserByUsername2("major.problem");
  // return await axios.get(`${baseURL}/auth/verify-login`, { withCredentials: true });
};

// Users apis ----------------------------------------------------------
export const getUserByUsername = async (username) => {
  await getUserByUsername2(username);

  // const response = await axios.get(`${baseURL}/users/user-info?username=${username}`, { withCredentials: true });
  // return response.data;
};

export const getAuthorByUsername = async (username) => {
  const response = await axios.get(`${baseURL}/users/author-info?username=${username}`);
  return await response.data;
};

export const toggleFavorite = async (tourIdObj) => {
  return await axios.put(`${baseURL}/users/toggle-favorite`, tourIdObj, { withCredentials: true });
};

export const getFavorites = async (params) => {
  const response = await axios.get(`${baseURL}/users/favorites${params}`, { withCredentials: true });
  return await response.data;
};

export const getMyTours = async (params) => {
  const response = await axios.get(`${baseURL}/users/my-tours${params}`, { withCredentials: true });
  return response.data;
};

// Tours apis ----------------------------------------------------------------------
// TODO: the "withCredentials" flag I don't think it should be set to true
export const getTours = async (queryString) => {
  const response = await axios.get(`${baseURL}/tours${queryString}`, { withCredentials: true });
  return await response.data;
};

// TODO: remove the withCredentials once you resolve the bug
export const getSingleTour = async (id) => {
  const response = await axios.get(`${baseURL}/tours/single-tour?id=${id}`, { withCredentials: true });
  return await response.data;
};

export const postTour = async (form) => {
  const response = await axios.post(`${baseURL}/tours/multiple`, form, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateTour = async (form, id) => {
  const response = await axios.put(`${baseURL}/tours/update?id=${id}`, form, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteTour = async (id) => {
  const response = await axios.delete(`${baseURL}/tours?id=${id}`, { withCredentials: true });
  return response;
};
