import { handleError } from "./apiUtils";
import { api_url, app } from "./calls";

export const login = async ({ username, password }: any) => {
  try {
    const response = await app
      .body({ username, password })
      .post(api_url + "/user/signin");
    // const student = handleResponse(response);
    if (response.status === 400) {
      const error = await response.text();
      throw new Error(error);
    }

    const student = await response.json();
    localStorage.setItem("jwt", student.data.accessToken);

    return student.data;
  } catch (error) {
    handleError(error);
  }
};
