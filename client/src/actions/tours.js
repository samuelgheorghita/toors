import * as api from "../apis";

export const setAllTours = () => async (dispatch, getState) => {
  try {
    const json = await api.getTours();
    dispatch({ type: "tours/setAllTours", payload: json });
  } catch (error) {
    console.log(error);
  }
};

export const setTourFilters = (partialFilter) => async (dispatch, getState) => {
  const filters = { ...getState().tours.filters };
  for (const key in partialFilter) {
    if (Object.hasOwnProperty.call(partialFilter, key)) {
      const elem = partialFilter[key];
      filters[key] = elem;
    }
  }

  dispatch({ type: "tours/setTourFilters", payload: filters });
};
