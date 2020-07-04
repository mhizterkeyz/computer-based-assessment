import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (state: any = initialState.exams, action: any) {
  switch (action.type) {
    case types.GET_EXAMS_SUCCESS:
    case types.CREATE_EXAM_SUCCESS:
      return { ...state, ...action.exams };
    case types.ADD_BIODATA_SUCCESS:
      return {
        ...state,
        [action.examId]: { ...state[action.examId], bioData: action.biodatas },
      };
    default:
      return state;
  }
}
