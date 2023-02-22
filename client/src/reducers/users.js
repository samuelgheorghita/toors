import { TOGGLE_ISLOGGED } from "../actions/actionTypes";

const initialState = {
  email: "",
  username: "",
  favorites: ["no elem in favorites arr!!!!!!!!!!!!!!!!!!!!!!!!!!!!"],
  isLogged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ISLOGGED:
      return { ...state, isLogged: !state.isLogged };
    case "users/getUserByUsername":
      return { ...state, ...action.payload.user };
    case "user/saveUserEmail":
      return { ...state, email: action.payload };
    case "users/loginUser":
      return { ...state, username: action.payload.username };
    case "users/logoutUser":
      return {};
    default:
      return state;
  }
};

export default usersReducer;
