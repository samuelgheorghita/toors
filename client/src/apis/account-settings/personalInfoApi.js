import axios from "axios";
import { baseURL } from "../globalApi";
import { customFetch } from "../helpers";

export const changeName = async (name) => {
  return await customFetch.post(`${baseURL}/users/account-settings/personal-info/name`, name);
};

export const changeEmail = async (email) => {
  return await customFetch.post(`${baseURL}/users/account-settings/personal-info/email`, email);
};

export const changeAbout = async (about) => {
  return await customFetch.post(`${baseURL}/users/account-settings/personal-info/about`, about);
};

export const changeProfileImg = async (imgProfileFormData) => {
  return await customFetch.post(`${baseURL}/users/account-settings/personal-info/profile-img`, imgProfileFormData);
};
