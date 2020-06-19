import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function (
  state = initialState.studentExamination,
  action: { type: string; studentExamination: any }
) {
  switch (action.type) {
    case types.LOAD_EXAMINATION_SUCCESS:
      return action.studentExamination;
    default:
      return state;
  };
};
