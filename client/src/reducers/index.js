import { combineReducers } from "redux";

import toursReducer from "./tours";
import usersReducer from "./users";

const allReducers = combineReducers({
  users: usersReducer,
  tours: toursReducer,
});

export default allReducers;
