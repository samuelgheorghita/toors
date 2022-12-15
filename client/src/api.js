import axios from "axios";

export const baseURL = "http://localhost:5000";
export const ipAdress = "http://localhost:5000/";

// Users apis ----------------------------------------------------------
export const postUser = async (registrationData) => {
  const response = await axios.post(`${baseURL}/users/signup`, registrationData);
  return await response.data;
};

export const loginUserApi = async (loginData) => {
  const response = await axios.post(`${baseURL}/users/login`, loginData, { withCredentials: true });
  return await response.data;
};

export const verifyLogin = async () => {
  return await axios.get(`${baseURL}/users/verify-login`, { withCredentials: true });
};

export const getUserByUsername = async (username) => {
  const response = await axios.get(`${baseURL}/users/user-info?username=${username}`, { withCredentials: true });
  return response.data;
};

export const toggleFavorite = async (tourIdObj) => {
  return await axios.put(`${baseURL}/users/toggle-favorite`, tourIdObj, { withCredentials: true });
};

export const getFavorites = async (username) => {
  const response = await axios.get(`${baseURL}/users/favorites?username=${username}`, { withCredentials: true });
  return await response.data;
};

export const getMyTours = async (username) => {
  const response = await axios.get(`${baseURL}/users/my-tours?username=${username}`, { withCredentials: true });
  return response.data;
};

// Tours apis ----------------------------------------------------------------------
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

export const updateTour = async (form) => {
  const response = await axios.put(`${baseURL}/tours/update`, form, {
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
