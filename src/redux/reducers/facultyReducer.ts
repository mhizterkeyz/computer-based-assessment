import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.faculty,
  action: { type: string; faculty: any }
) {
  switch (action.type) {
    case types.GET_FACULTY_SUCCESS:
      return action.faculty;
    default:
      return state;
  }
}
