import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.results,
  action: { type: string; result: any }
) {
  switch (action.type) {
    case types.GET_RESULTS_SUCCESS:
      return { ...state, ...action.result };
    default:
      return state;
  }
};
