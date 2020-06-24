import { app as api } from "./calls";

const apiUrl = "http://localhost:8000/api/v1/administrator";

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

export const loginAdministrator = async ({ username, password }: any) => {
  try {
    const req = await api.body({ username, password }).post(`${apiUrl}/signin`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    localStorage["jwt"] = res.data.accessToken;
    localStorage["route"] = "administrator";
    api.headers({ Authorization: "Bearer " + localStorage["jwt"] });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const verifyAdministrator = async () => {
  try {
    const def = {
      name: "",
      email: "",
      username: "",
    };
    const route = localStorage["route"];
    const jwt = localStorage["jwt"];

    if (!route || route !== "administrator") {
      return def;
    }

    const req = await api
      .headers({ Authorization: `Bearer ${jwt}` })
      .get(`${apiUrl}/me`);
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
    const req = await api.get(`${apiUrl}/exams`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
      {}
    );
  } catch (error) {
    throw error;
  }
};

export const updateExamstatus = async (exam_id:string, exam_status:any) => {
  try {
    const req = await api.body(exam_status).put(`${apiUrl}/exams/${exam_id}`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const submitExam = async (data: any) => {
  try {
    const req = await api
      .body(data)
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(`${apiUrl}/exams`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return { [res.data._id]: res.data };
  } catch (error) {
    throw error;
  }
};

export const getBioData = async (base64: string) => {
  const req = await api.body({ base64 }).post(`${apiUrl}/spreadsheet/biodata`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const getQuestions = async (base64: string) => {
  const req = await api
    .body({ base64 })
    .post(`${apiUrl}/spreadsheet/examquestion`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const uploadImage = async (base64: string) => {
  const req = await api.body({ base64 }).post(`${apiUrl}/image/upload`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const createPin = async (count: any) => {
  try {
    const req = await api
      .body(count)
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(`${apiUrl}/pins`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPin = async () => {
  try {
    const req = await api.get(`${apiUrl}/pins`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
      {}
    );
  } catch (error) {
    throw error;
  }
};

export const getAdministrators = async () => {
  try {
    const req = await api.get(`${apiUrl}`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
      {}
    );
  } catch (error) {
    throw error;
  }
};

export const createAdministrators = async (newAdministrator: any) => {
  try {
    const req = await api
      .body(newAdministrator)
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(apiUrl);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdministrator = async (admin_id: string) => {
  try {
    const req = await api
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .delete(`${apiUrl}/${admin_id}`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getResults = async (exam_id: string) => {
  try {
    const req = await api.get(`${apiUrl}/exams/${exam_id}/results`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data
  } catch (error) {
    throw error;
  }
};
