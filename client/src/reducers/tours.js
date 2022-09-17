const initialState = {
  list: [],
  isLoaded: false,
};

const toursReducer = (state = initialState, action) => {
  switch (action.type) {
    case "tours/setAllTours":
      return { ...state, list: action.payload, isLoaded: true };
    default:
      return state;
  }
};

export default toursReducer;
