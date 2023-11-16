import {
  combineReducers
} from "redux";
import userAuthReducer from "./userAuthReducer";
import alertReducer from "./alertReducer";
import allUserReducer from "./allUserReducer";

const myReducer = combineReducers({
  user: userAuthReducer,
  alert: alertReducer,
  allUsers: allUserReducer,
});

export default myReducer;