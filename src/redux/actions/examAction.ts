import * as types from "./actionTypes";
import * as studentApi from "../../api/studentApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// export function createCourse(course) {
//   return { type: types.CREATE_COURSE, course };
// };

export function loadExamSuccess(studentExamination: any) {
  return { type: types.LOAD_EXAMINATION_SUCCESS, studentExamination };
}
export function loadStudentExamination(updateCall: boolean = false) {
  return async function (dispatch: any) {
    try {
      !updateCall && dispatch(beginApiCall());
      const examination = await studentApi.getExams();
      if (examination.examNotFound) return dispatch({ type: "_SUCCESS" });
      examination.answered = examination.answered.reduce(
        (acc: any, cur: any) => ({ ...acc, [cur.questionId]: cur }),
        {}
      );
      return dispatch(loadExamSuccess(examination));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
}
