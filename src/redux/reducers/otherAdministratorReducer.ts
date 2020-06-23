import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.otherAdministrator,
  action: { type: string; admin: any }
) {
  switch (action.type) {
    case types.CREATE_ADMINISTRATOR_SUCCESS:
    case types.GET_ADMINISTRATOR_SUCCESS:
    case types.DELETE_ADMINISTRATOR_OPTIMISTIC:
      return { ...state, ...action.admin };
    default:
      return state;
  }
}
