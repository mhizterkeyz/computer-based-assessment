import { combineReducers } from "redux";
import student from "./studentReducer";
import apiCallsInProgress from "./apiStatusReducer";
import administrator from "./administratorReducer";
import exams from "./ExamsReducer";

export const rootReducer = combineReducers({
  student,
  administrator,
  apiCallsInProgress,
  exams,
});

// export default rootReducer;
