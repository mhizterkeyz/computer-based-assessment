import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.faculty,
  action: { type: string; faculties: any; faculty: any }
) {
  switch (action.type) {
    case types.GET_FACULTY_SUCCESS:
      return action.faculties;
    case types.CREATE_FACULTY_SUCCESS:
      return [...state, { ...action.faculty }];
    default:
      return state;
  }
}
