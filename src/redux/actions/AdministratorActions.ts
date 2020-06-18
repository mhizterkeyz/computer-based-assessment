import * as types from "./actionTypes";
import * as Api from "../../api/AdministratorCalls";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const AdministratorSigninSuccess = (administrator: any) => ({
  type: types.ADMINISTRATOR_SIGNIN_SUCCESS,
  administrator,
});

export const AdministratorVerifySuccess = (administrator: any) => ({
  type: types.VERIFY_ADMIN_SUCCESS,
  administrator,
});

export const getExamsSuccess = (exams: any) => ({
  type: types.GET_EXAMS_SUCCESS,
  exams,
});

export const createExamSuccess = (exams: any) => ({
  type: types.CREATE_EXAM_SUCCESS,
  exams,
});

export function SignInAdmin({ username, password }: any) {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const administrator = await Api.loginAdministrator({
        username,
        password,
      });
      return dispatch(AdministratorSigninSuccess(administrator));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
}

export function VerifyAdministrator() {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const administrator = await Api.verifyAdministrator();
      return dispatch(AdministratorVerifySuccess(administrator));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
}

export const loadUpExams = () => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const exam = await Api.getExams();
      return dispatch(getExamsSuccess(exam));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const createExam = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      debugger;
      const exam = await Api.submitExam(data);
      return dispatch(createExamSuccess(exam));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};
