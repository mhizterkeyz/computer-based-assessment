import { handleError } from "./apiUtils";
import { api_url, app as api } from "./calls";

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
      .get(`${api_url}/user`);
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
