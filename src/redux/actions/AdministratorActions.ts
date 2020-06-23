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

export const getPinSuccess = (pin: any) => ({
  type: types.GET_PIN_SUCCESS,
  pin,
});

export const CreatePinSuccess = (pin: any) => ({
  type: types.GET_PIN_SUCCESS,
  pin,
});

export const getAdministratorsSuccess = (admin: any) => ({
  type: types.GET_ADMINISTRATOR_SUCCESS,
  admin,
});

export const createAdministratorsSuccess = (admin: any) => ({
  type: types.CREATE_ADMINISTRATOR_SUCCESS,
  admin,
});

export function deleteAdministratorOptimistic(admin_id:string) {
  return { type: types.DELETE_ADMINISTRATOR_OPTIMISTIC, admin_id}
};

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
      const exam = await Api.submitExam(data);
      return dispatch(createExamSuccess(exam));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const loadPin = () => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const pin = await Api.getPin();
      return dispatch(getPinSuccess(pin));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const createPin = (count: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const pin = await Api.createPin(count);
      return dispatch(CreatePinSuccess(pin));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};


export const getAdministrators = () => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const admin = await Api.getAdministrators();
      return dispatch(getAdministratorsSuccess(admin));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const createAdministrator = (newAdministrator:any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const admin = await Api.createAdministrators(newAdministrator);
      return dispatch(createAdministratorsSuccess(admin));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export function deleteAdministrator(admin_id:string) {
  return function (dispatch:any) {
    dispatch(deleteAdministratorOptimistic(admin_id));
    return Api.deleteAdministrator(admin_id);
  };
};