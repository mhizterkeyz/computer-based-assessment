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
    case types.DELETE_FACULTY_OPTIMISTIC:
      return state.reduce((acc: any, cur: any) => {
        if (cur._id === action.faculty) return acc;
        return [...acc, cur];
      }, []);
    default:
      return state;
  }
}
