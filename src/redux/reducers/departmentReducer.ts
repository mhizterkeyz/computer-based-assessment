import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.faculty,
  action: { type: string; department: any }
) {
  switch (action.type) {
    case types.CREATE_DEPARTMENT_SUCCESS:
      return action.department;
    default:
      return state;
  }
}
