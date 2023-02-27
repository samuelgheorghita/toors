const initialState = {
  filters: {},
};

const toursReducer = (state = initialState, action) => {
  switch (action.type) {
    case "tours/setTourFilters":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

export default toursReducer;
