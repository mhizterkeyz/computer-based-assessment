import { handleError } from "./apiUtils";
import { api_url, app as api } from "./calls";

const parseResponseError = ({ res, status, statusText }: any) => {
  if (status >= 400) {
    const message =
      res.message +
      "\n" +
      Object.values(res.data || {}).reduce((acc: any, cur: any) => {
        if (typeof cur === "object") {
          return acc + "\n" + JSON.stringify(cur);
        }
        return acc + "\n" + cur.toString();
      }, "");
    const err = new Error(message);
    err.name = statusText.replace(" ", "_");
    throw err;
  }
};

export const login = async ({ username, password }: any) => {
  try {
    const response = await api
      .body({ username, password })
      .post(api_url + "/user/signin");
    // const student = handleResponse(response);
    if (response.status === 400) {
      const error = await response.text();
      throw new Error(error);
    }

    const student = await response.json();
    localStorage.setItem("jwt", student.data.accessToken);
    localStorage.setItem("route", "student");

    return student.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyStudent = async () => {
  try {
    const def = {
      matric: "",
    };
    const route = localStorage["route"];
    const jwt = localStorage["jwt"];

    if (!route || route !== "student") {
      return def;
    }

    const req = await api
      .headers({ Authorization: `Bearer ${jwt}` })
      .get(`${api_url}/user/me`);
    const { status } = req;
    const res = await req.json();
    if (status >= 400) {
      delete localStorage["route"];
      return def;
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getExams = async () => {
  try {
    const req = await api
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(`${api_url}/user/exams`);
    // const { statusText, status } = req;
    const res = await req.json();
    debugger;
    if (res.status === 400) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
