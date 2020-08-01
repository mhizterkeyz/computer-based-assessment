import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (state: any = initialState.exams, action: any) {
  switch (action.type) {
    case types.DELETE_EXAM_OPTIMISTIC:
      return Object.keys(state).reduce((acc: any, cur: string) => {
        if (cur === action.exam_id) return acc;
        return { ...acc, [cur]: state[cur] };
      }, {});
    case types.GET_EXAMS_SUCCESS:
      return _.merge({}, state, action.exams);
    case types.CREATE_EXAM_SUCCESS:
      return { ...state, ...action.exams };
    case types.ADD_BIODATA_SUCCESS:
      return {
        ...state,
        [action.examId]: { ...state[action.examId], bioData: action.biodatas },
      };
    case types.UPDATE_SINGLE_BIODATA_SUCCESS:
      return {
        ...state,
        [action.examId]: {
          ...state[action.examId],
          bioData: Object.values({
            ...state[action.examId].bioData.reduce(
              (acc: any, cur: any) => ({
                ...acc,
                [cur._id]: cur,
              }),
              {}
            ),
            [action.biodataId]: action.biodatas,
          }),
        },
      };
    default:
      return state;
  }
}
