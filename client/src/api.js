import axios from "axios";

export const baseURL = "http://localhost:5000";

// Users apis
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

// Tours apis
export const getTours = async () => {
  const response = await axios.get(`${baseURL}/tours`, { withCredentials: true });
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
