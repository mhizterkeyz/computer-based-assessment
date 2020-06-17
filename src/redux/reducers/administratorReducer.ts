import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.administrator,
  action: { type: string; administrator: any }
) {
  switch (action.type) {
    case types.ADMINISTRATOR_SIGNIN_SUCCESS:
    case types.VERIFY_ADMIN_SUCCESS:
      return { ...state, ...action.administrator };
    default:
      return state;
  }
}
