import { TOGGLE_ISLOGGED } from "../actions/actionTypes";

const initialState = {
  email: "",
  username: "staticUsername",
  isLogged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ISLOGGED:
      return { ...state, isLogged: !state.isLogged };
    case "user/saveUserEmail":
      return { ...state, email: action.payload };
    case "users/loginUser":
      return { ...state, email: action.payload.email, username: action.payload.username };
    default:
      return state;
  }
};

export default usersReducer;
