import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function courseReducer(
  state = initialState.students,
  action: { type: string; student: any }
) {
  switch (action.type) {
    case types.LOAD_STUDENT_SUCCESS:
    case types.VERIFY_STUDENT_SUCCESS:
      return action.student;
    default:
      return state;
  }
}
