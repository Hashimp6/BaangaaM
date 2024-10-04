// src/redux/reducers/index.js
import { combineReducers } from "redux";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  shop:shopReducer,
  // Add other reducers here
});

export default rootReducer;
