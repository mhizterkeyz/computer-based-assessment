import * as types from "../actions/actionTypes";
import initialState from "./initialState";

function actionTypeEndsInSuccess(type:string) {
  return type.substring(type.length - 8) === "_SUCCESS"
};

export default function apiCallStatusReducer(
  state = initialState.apiCallsInProgress,
  action:any
) {
  if (action.type === types.BEGIN_API_CALL) {
    return state + 1;
  } else if (
    action.types === types.API_CALL_ERROR ||
    actionTypeEndsInSuccess(action.type)
  ) {
    return state - 1;
  }
  return state;
};