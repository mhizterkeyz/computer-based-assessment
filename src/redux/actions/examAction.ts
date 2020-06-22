import * as types from "./actionTypes";
import * as studentApi from "../../api/studentApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// export function createCourse(course) {
//   return { type: types.CREATE_COURSE, course };
// };

export function loadExamSuccess(studentExamination:any) {
  return { type: types.LOAD_EXAMINATION_SUCCESS, studentExamination };
}

export function loadStudentExamination() {
  return async function (dispatch: any) {
    try {
      dispatch(beginApiCall());
      const examination = await studentApi.getExams();
      return dispatch(loadExamSuccess(examination));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
}
