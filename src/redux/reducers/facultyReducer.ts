import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (
  state = initialState.faculty,
  action: { type: string; faculties: any; faculty: any; department: any }
) {
  switch (action.type) {
    case types.GET_FACULTY_SUCCESS:
      return action.faculties;
    case types.CREATE_FACULTY_SUCCESS:
      return _.merge({}, state, action.faculty);
    case types.CREATE_DEPARTMENT_SUCCESS:
      return _.merge({}, state, action.department);
    case types.DELETE_FACULTY_OPTIMISTIC:
      return Object.values(state).reduce((acc: any, cur: any) => {
        if (cur._id === action.faculty) return acc;
        return { ...acc, [cur._id]: cur };
      }, {});
    case "DEPARTMENT_DELETED":
      return Object.values(state).reduce((acc: any, cur: any) => {
        if (action.faculty === cur._id) {
          return {
            ...acc,
            [cur._id]: Object.keys(cur).reduce((ac: any, cu: any) => {
              if (cu === "departments") {
                return {
                  ...ac,
                  [cu]: Object.values(cur[cu]).reduce((a: any, c: any) => {
                    if (c._id === action.department) return a;
                    return { ...a, [c._id]: c };
                  }, {}),
                };
              }
              return { ...ac, [cu]: cur[cu] };
            }, {}),
          };
        }
        return { ...acc, [cur._id]: cur };
      }, {});
    default:
      return state;
  }
}
