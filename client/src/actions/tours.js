import * as api from "../api";

export const setAllTours = () => async (dispatch, getState) => {
  const json = await api.getTours();
  console.log(json);
  dispatch({ type: "tours/setAllTours", payload: json });
};
