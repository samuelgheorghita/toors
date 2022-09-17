import axios from "axios";

const baseURL = "http://localhost:5000";

export const postUser = async (registrationData) => {
  const response = await axios.post(`${baseURL}/users/signup`, registrationData);
  return await response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${baseURL}/users/login`, loginData, { withCredentials: true });
  return await response.data;
};

export const getTours = async () => {
  const response = await axios.get(`${baseURL}/tours`, { withCredentials: true });
  return await response.data;
};
