import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (
  state = initialState.otherAdministrator,
  action: { type: string; admin: any; admin_id: string }
) {
  switch (action.type) {
    case types.GET_ADMINISTRATOR_SUCCESS:
      return action.admin;
    case types.CREATE_ADMINISTRATOR_SUCCESS:
      return _.merge({}, state, action.admin);
    case types.DELETE_ADMINISTRATOR_OPTIMISTIC:
      return Object.values(state).reduce((acc: any, cur: any) => {
        if (cur._id === action.admin_id) return acc;
        return { ...acc, [cur._id]: cur };
      }, {});
    default:
      return state;
  }
}
