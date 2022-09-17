import { TOGGLE_ISLOGGED } from "../actions/actionTypes";

const initialState = {
  email: "",
  isLogged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ISLOGGED:
      return { ...state, isLogged: !state.isLogged };
    default:
      return state;
  }
};

export default usersReducer;
