import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.exams,
  action: { type: string; exams: any }
) {
  switch (action.type) {
    case types.GET_EXAMS_SUCCESS:
    case types.CREATE_EXAM_SUCCESS:
      return { ...state, ...action.exams };
    default:
      return state;
  }
}
