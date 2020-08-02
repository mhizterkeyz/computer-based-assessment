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
      if (action.page) {
        const misc = Object.keys(state)
          .filter((elem: any) => typeof state[elem] !== "object")
          .reduce((acc: any, cur: any) => ({ ...acc, [cur]: state[cur] }), {});
        const arr = (function categorize(arra, res = {}, page = 1): any {
          // @ts-ignore
          res[page] = arra.splice(0, 5).reduce((acc: any, cur: any) => {
            return { ...acc, [cur._id]: cur };
          }, {});
          if (arra.length <= 0) return res;
          return categorize(arra, res, ++page);
        })(
          Object.values(state).filter((elem: any) => typeof elem === "object")
        );
        arr[action.page] = action.exams;
        return {
          // @ts-ignore
          ...Object.values(arr).reduce(
            (acc: any, cur: any) => ({ ...acc, ...cur }),
            {}
          ),
          ...misc,
        };
      }
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
