import { combineReducers } from "redux";
import student from "./studentReducer";
import apiCallsInProgress from "./apiStatusReducer";

export const rootReducer = combineReducers({
  student,
  apiCallsInProgress
});

// export default rootReducer;