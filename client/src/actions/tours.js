import * as api from "../api";

export const setAllTours = () => async (dispatch, getState) => {
  const json = await api.getTours();
  dispatch({ type: "tours/setAllTours", payload: json });
};
