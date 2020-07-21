import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (state: any = initialState.biodatas, action: any) {
  switch (action.type) {
    case types.GET_BIODATA_SUCCESS:
      return _.merge({}, state, action.biodatas);
    default:
      return state;
  }
}
