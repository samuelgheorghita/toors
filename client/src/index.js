import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { composeWithDevTools } from "@redux-devtools/extension";

import App from "./App";
import allReducers from "./reducers/index";

const persistConfig = {
  key: "root",
  storage,
};

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
const store = createStore(allReducers, composedEnhancer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
