import { TOGGLE_ISLOGGED } from "./actionTypes";
import * as api from "../api.js";

export const toggleIsLogged = () => {
  return {
    type: TOGGLE_ISLOGGED,
  };
};

export const changeProfileImg = (img) => {
  return {
    type: "users/changeProfileImg",
    payload: img,
  };
};

export const loginUser = (form) => async (dispatch, getState) => {
  try {
    const json = await api.loginUserApi(form);
    console.log(json.favorites);
    dispatch({
      type: "users/loginUser",
      payload: json,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByUsername = (username) => async (dispatch, getState) => {
  try {
    const user = await api.getUserByUsername(username);
    console.log(user);
    dispatch({ type: "users/getUserByUsername", payload: { user } });
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = () => {
  return {
    type: "users/logoutUser",
  };
};

export const changeFavorites = (id) => (dispatch) => {
  dispatch({ type: "users/changeFavorites", payload: id });
};

export const saveUserEmail = (email) => (dispatch, getState) => {
  dispatch({ type: "user/saveUserEmail", payload: email });
};
