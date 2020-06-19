import { combineReducers } from "redux";
import student from "./studentReducer";
import apiCallsInProgress from "./apiStatusReducer";
import administrator from "./administratorReducer";
import exams from "./ExamsReducer";
import studentExamination from "./studentExamReducer";

export const rootReducer = combineReducers({
  student,
  administrator,
  apiCallsInProgress,
  exams,
  studentExamination
});

// export default rootReducer;
