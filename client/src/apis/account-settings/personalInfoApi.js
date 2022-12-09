import axios from "axios";
import { baseURL } from "../globalApi";

export const changeName = async (name) => {
  //   for (const pair of formData.entries()) {
  //     console.log(`${pair[0]}, ${pair[1]}`);
  //   }
  return await axios.post(`${baseURL}/users/account-settings/personal-info/name`, name, { withCredentials: true });
};

export const changeEmail = async (email) => {
  return await axios.post(`${baseURL}/users/account-settings/personal-info/email`, email, { withCredentials: true });
};

export const changeAbout = async (about) => {
  return await axios.post(`${baseURL}/users/account-settings/personal-info/about`, about, { withCredentials: true });
};

export const changeProfileImg = async (imgProfileFormData) => {
  return await axios.post(`${baseURL}/users/account-settings/personal-info/profile-img`, imgProfileFormData, { withCredentials: true });
};
