import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (state: any = initialState.counts, action: any) {
  switch (action.type) {
    case types.UPDATE_COUNTS:
      return _.merge({}, state, action.count);
    default:
      return state;
  }
}
