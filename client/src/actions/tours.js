import * as api from "../apis";
import { objectToParams } from "../tools/functions/functions.js";

export const setAllTours = () => async (dispatch, getState) => {
  try {
    const json = await api.getTours();
    console.log(json);
    dispatch({ type: "tours/setAllTours", payload: json });
  } catch (error) {
    console.log(error);
  }
};

export const setTourFilters = (partialFilter) => async (dispatch, getState) => {
  console.log(getState().tours.filters);
  const filters = { ...getState().tours.filters };
  for (const key in partialFilter) {
    if (Object.hasOwnProperty.call(partialFilter, key)) {
      const elem = partialFilter[key];
      filters[key] = elem;
    }
  }

  // TODO: see if it's wise to save the query string on the redux, probably not
  const filterStr = objectToParams(filters);

  dispatch({ type: "tours/setTourFilters", payload: filters });
};
