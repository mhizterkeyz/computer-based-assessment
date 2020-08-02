import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from "lodash";

export default function (state: any = initialState.biodatas, action: any) {
  switch (action.type) {
    case types.GET_BIODATA_SUCCESS:
      if (action.page && action.id) {
        const misc = Object.keys(state[action.id])
          .filter((elem: any) => typeof state[action.id][elem] !== "object")
          .reduce(
            (acc: any, cur: any) => ({ ...acc, [cur]: state[action.id][cur] }),
            {}
          );
        const arr = (function categorize(arra, res = {}, page = 1): any {
          // @ts-ignore
          res[page] = arra.splice(0, 5).reduce((acc: any, cur: any) => {
            return { ...acc, [cur._id]: cur };
          }, {});
          if (arra.length <= 0) return res;
          return categorize(arra, res, ++page);
        })(
          Object.values(state[action.id]).filter(
            (elem: any) => typeof elem === "object"
          )
        );
        arr[action.page] = action.biodatas[action.id];
        const tilt = Object.keys(state).reduce((acc: any, cur: any) => {
          if (cur === action.id) {
            return {
              ...acc,
              [cur]: {
                // @ts-ignore
                ...Object.values(arr).reduce(
                  (acc: any, cur: any) => ({ ...acc, ...cur }),
                  {}
                ),
                ...misc,
              },
            };
          }
          return { ...acc, [cur]: state[cur] };
        }, {});
        return tilt;
      }
      return _.merge({}, state, action.biodatas);
    default:
      return state;
  }
}
