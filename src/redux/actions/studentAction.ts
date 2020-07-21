import * as types from "./actionTypes";
import * as studentApi from "../../api/studentApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// export function createCourse(course) {
//   return { type: types.CREATE_COURSE, course };
// };

export function loadStudentSuccess(student: any) {
  return { type: types.LOAD_STUDENT_SUCCESS, student };
}

export function verifyStudentSuccess(student: any) {
  return { type: types.VERIFY_STUDENT_SUCCESS, student };
}

export function loadStudent({ "matric-no": username, password }: any) {
  return async function (dispatch: any) {
    try {
      dispatch(beginApiCall());
      const student = await studentApi.login({ username, password });
      return dispatch(loadStudentSuccess(student));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
}

export function verifyStudent(updateCall: boolean = false) {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const student = await studentApi.verifyStudent();
      return dispatch(verifyStudentSuccess(student));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
}
