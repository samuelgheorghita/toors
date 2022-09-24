import { TOGGLE_ISLOGGED } from "./actionTypes";
import { loginUserApi } from "../api.js";

export const toggleIsLogged = () => {
  return {
    type: TOGGLE_ISLOGGED,
  };
};

export const loginUser = (form) => async (dispatch, getState) => {
  try {
    const json = await loginUserApi(form);
    console.log(form);
    console.log("inside the loginUser action creator");
    console.log(json.username);
    const username = json.username;
    dispatch({ type: "users/loginUser", payload: { email: form.email, username: username } });
  } catch (error) {
    console.log(error);
  }
};

export const saveUserEmail = (email) => (dispatch, getState) => {
  dispatch({ type: "user/saveUserEmail", payload: email });
};
