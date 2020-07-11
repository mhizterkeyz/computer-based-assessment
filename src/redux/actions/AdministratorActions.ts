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

export const updateExamStatusSuccess = (exams: any) => ({
  type: types.UPDATE_EXAMS_SUCCESS,
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

export const deleteAdministratorOptimistic = (admin_id: string) => ({
  type: types.DELETE_ADMINISTRATOR_OPTIMISTIC,
  admin_id,
});

export const getResultSuccess = (result: any) => ({
  type: types.GET_RESULTS_SUCCESS,
  result,
});

export const getFacultySuccess = (faculties: any) => ({
  type: types.GET_FACULTY_SUCCESS,
  faculties,
});

export const createFacultySuccess = (faculty: any) => ({
  type: types.CREATE_FACULTY_SUCCESS,
  faculty,
});

export function deleteFacultyOptimistic(faculty: string) {
  return { type: types.DELETE_FACULTY_OPTIMISTIC, faculty };
}

export const createDepartmentSuccess = (department: any) => ({
  type: types.CREATE_DEPARTMENT_SUCCESS,
  department,
});

export const addBiodataSuccess = (biodatas: any, examId: any) => ({
  type: types.ADD_BIODATA_SUCCESS,
  biodatas,
  examId,
});

export const updateBiodataSuccess = (
  biodatas: any,
  examId: any,
  biodataId: any
) => ({
  type: types.UPDATE_SINGLE_BIODATA_SUCCESS,
  biodatas,
  examId,
  biodataId,
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

export function VerifyAdministrator(updateCall: boolean = false) {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const administrator = await Api.verifyAdministrator();
      return dispatch(AdministratorVerifySuccess(administrator));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
}

export const loadUpExams = (updateCall: boolean = false) => {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const exam = await Api.getExams();
      return dispatch(getExamsSuccess(exam));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
};

export const updateExamStatus = (exam_id: string, exam_status: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const exam = await Api.updateExamstatus(exam_id, exam_status);
      return dispatch(updateExamStatusSuccess(exam));
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

export const loadUpResults = (exam_id: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const results = await Api.getResults(exam_id);
      return dispatch(getResultSuccess(results));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const loadPin = (updateCall: boolean = false) => {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const pin = await Api.getPin();
      return dispatch(getPinSuccess(pin));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
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

export const getAdministrators = (updateCall: boolean = false) => {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const admin = await Api.getAdministrators();
      return dispatch(getAdministratorsSuccess(admin));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
};

export const createAdministrator = (newAdministrator: any) => {
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

export function deleteAdministrator(admin_id: string) {
  return function (dispatch: any) {
    dispatch(deleteAdministratorOptimistic(admin_id));
    return Api.deleteAdministrator(admin_id);
  };
}

export const getFaculty = (updateCall: boolean = false) => {
  return async (dispatch: any) => {
    try {
      !updateCall && dispatch(beginApiCall());
      const faculty = await Api.getFaculty();
      return dispatch(getFacultySuccess(faculty));
    } catch (error) {
      !updateCall && dispatch(apiCallError());
      throw error;
    }
  };
};

export const deleteDepartment = (department: string, faculty_id: string) => {
  return async (dispatch: any) => {
    try {
      await Api.deleteDepartment(department, faculty_id);
      dispatch(beginApiCall());
      const faculty = await Api.getFaculty();
      dispatch(getFacultySuccess(faculty));
      dispatch(apiCallError());
    } catch (error) {
      dispatch(beginApiCall());
      const faculty = await Api.getFaculty();
      dispatch(getFacultySuccess(faculty));
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const createFaculty = (faculty: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const facultyDta = await Api.createFaculty(faculty);
      return dispatch(createFacultySuccess(facultyDta));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const deleteFaculty = (faculty_id: string) => {
  return async (dispatch: any) => {
    dispatch(deleteFacultyOptimistic(faculty_id));
    return await Api.deleteFaculty(faculty_id);
  };
};

export const createDepartment = (faculty_id: string, department: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const departmentDta = await Api.createDepartment(faculty_id, department);
      return dispatch(createDepartmentSuccess(departmentDta));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const addBiodata = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const biodatas = await Api.addBiodata(data);
      return dispatch(addBiodataSuccess(biodatas, data.examId));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const updateBiodata = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const biodatas = await Api.updateSingleBiodata(data);
      return dispatch(
        updateBiodataSuccess(biodatas, data.examId, data.biodataId)
      );
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};

export const updateAccount = (update: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(beginApiCall());
      const administrator = await Api.updateAccount(update);
      return dispatch(AdministratorSigninSuccess(administrator));
    } catch (error) {
      dispatch(apiCallError());
      throw error;
    }
  };
};
