import * as types from "../actions/actionTypes";

export default function courseReducer(
  state = [],
  action: { type: string; student: any }
) {
  switch (action.type) {
    case types.LOAD_STUDENT_SUCCESS:
      return action.student;
    default:
      return state;
  }
}
