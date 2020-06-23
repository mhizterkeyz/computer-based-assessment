import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.pins,
  action: { type: string; pin: any }
) {
  switch (action.type) {
    case types.GET_PIN_SUCCESS:
    case types.CREATE_PIN_SUCCESS:
      return { ...state, ...action.pin };
    default:
      return state;
  }
};
