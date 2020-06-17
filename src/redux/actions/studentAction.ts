import * as types from "./actionTypes";
import * as studentApi from "../../api/studentApi";
import { student } from "../../components/model/student";

// export function createCourse(course) {
//   return { type: types.CREATE_COURSE, course };
// };

export function loadStudentSuccess(student: student) {
    return { type: types.LOAD_STUDENT_SUCCESS, student };
}

export function loadStudent({"matric-no":username, password}:any) {
  return async function (dispatch: any) {
    try {
      const student = await studentApi.login({username, password});
      return dispatch(loadStudentSuccess(student));
    } catch (error) {
      throw error;
    }
  };
}
