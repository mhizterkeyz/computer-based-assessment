import { app as api } from "./calls";

const apiUrl = `http://${window.location.hostname}:8000/api/v1/administrator`;

export const parseResponseError = ({ res, status, statusText }: any) => {
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
  const req = await api.body({ username, password }).post(`${apiUrl}/signin`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  localStorage["jwt"] = res.data.accessToken;
  localStorage["route"] = "administrator";
  api.headers({ Authorization: "Bearer " + localStorage["jwt"] });
  return { loaded: true, ...res.data, loggedIn: true };
};

export const verifyAdministrator = async () => {
  try {
    const def = {
      loggedIn: false,
      name: "",
      email: "",
      username: "",
      loaded: true,
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
    return { loggedIn: true, ...res.data, loaded: true };
  } catch (error) {
    throw error;
  }
};
// const slugify = (data: string): string => {
//   data = data.replace(" ", "-").toLowerCase();
//   if (data.includes(" ")) {
//     return slugify(data);
//   }
//   return data;
// };
export const getExams = async (page = 1, search = "") => {
  const url =
    search.length > 0
      ? `${apiUrl}/exams?page=${page}&&search=${search}`
      : `${apiUrl}/exams?page=${page}`;
  const req = await api.get(url);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  let special = {};
  let exams = res.data.exams.reduce((acc: any, cur: any, i: number) => {
    if (parseInt(cur.status) === 1) {
      special = {
        activeFound: true,
        activeId: cur._id,
      };
    }
    return { ...acc, [cur._id]: { ...cur, loaded: true } };
  }, {});
  return {
    exams: { ...special, loaded: true, ...exams },
    count: res.data.count,
  };
};

export const getOneExam = async (id: string) => {
  const req = await api.get(`${apiUrl}/exams/${id}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  let special = {};
  if (res.data.exam && parseInt(res.data.exam.status) === 1) {
    special = {
      activeFound: true,
      activeId: res.data.exam._id,
    };
  }
  if (!res.data.exam) {
    return { exams: { loaded: true } };
  }
  return {
    exams: {
      ...special,
      loaded: true,
      [res.data.exam._id]: { ...res.data.exam, loaded: true },
    },
    count: res.data.count,
  };
};

export const getExamQuestion = async (id: string, page = 1) => {
  const req = await api.get(`${apiUrl}/exams/${id}/questions?page=${page}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  const questions = res.data.questions.reduce(
    (acc: any, cur: any) => ({ ...acc, [page]: cur }),
    {}
  );
  return {
    exams: {
      [id]: {
        questions,
      },
    },
    count: res.data.count,
  };
};

export const getOneBioData = async (id: string, page = 1, search = "") => {
  const url =
    search.length > 0
      ? `${apiUrl}/exams/${id}/biodatas?page=${page}&&search=${search}`
      : `${apiUrl}/exams/${id}/biodatas?page=${page}`;
  const req = await api.get(url);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  const biodatas = res.data.biodata.reduce(
    (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
    {}
  );
  return {
    biodatas: {
      [id]: biodatas,
    },
    count: res.data.count,
    done: res.data.done,
    running: res.data.running,
    pending: res.data.pending,
  };
};

export const updateExam = async (exam_id: string, data: any) => {
  try {
    const req = await api.body(data).put(`${apiUrl}/exams/${exam_id}`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return { exams: { [res.data._id]: res.data } };
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
    return {
      exams: {
        [res.data.exam._id]: {
          ...res.data.exam,
          questions: res.data.questions
            ? res.data.questions
                .sort((a: any, b: any) => {
                  const d1: any = new Date(a.createdAt);
                  const d2: any = new Date(b.createdAt);
                  return d1 - d2;
                })
                .reduce(
                  (acc: any, cur: any, i: number) => ({ ...acc, [i + 1]: cur }),
                  {}
                )
            : {},
        },
      },
      count: res.data.examCount,
      biodatas: {
        [res.data.exam._id]: res.data.bioData
          ? res.data.bioData.reduce(
              (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
              {}
            )
          : {},
      },
      biodataCount: {
        biodatas: {
          [res.data.exam._id]: {
            count: res.data.bioData ? res.data.bioData.length : 0,
            done: 0,
            pending: res.data.bioData ? res.data.bioData.length : 0,
            running: 0,
          },
        },
      },
      questionsCount: {
        questions: {
          [res.data.exam._id]: res.data.questions
            ? res.data.questions.length
            : 0,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getBioData = async (base64: any) => {
  const req = await api.body({ base64 }).post(`${apiUrl}/spreadsheet/biodata`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const getQuestions = async (base64: any) => {
  const req = await api
    .body({ base64 })
    .post(`${apiUrl}/spreadsheet/examquestion`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const uploadImage = async (base64: any) => {
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
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFaculty = async () => {
  try {
    const req = await api.get(`${apiUrl}/faculty`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return {
      ...res.data.reduce(
        (acc: any, cur: any) => ({
          ...acc,
          [cur._id]: {
            ...cur,
            departments: cur.departments.reduce(
              (ac: any, cu: any) => ({ ...ac, [cu._id]: cu }),
              {}
            ),
          },
        }),
        {}
      ),
      loaded: true,
    };
  } catch (error) {
    throw error;
  }
};

export const createFaculty = async (faculty: string) => {
  try {
    const req = await api
      .body({ faculty: faculty })
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(`${apiUrl}/faculty`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFaculty = async (faculty_id: string) => {
  const req = await api
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .delete(`${apiUrl}/faculty/${faculty_id}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const deleteDepartment = async (
  department: string,
  faculty_id: string
) => {
  const req = await api
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .delete(`${apiUrl}/faculty/${faculty_id}/departments/${department}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const createDepartment = async (
  faculty_id: string,
  department: string
) => {
  try {
    const req = await api
      .body({ department: department })
      .headers({ Authorization: "Bearer " + localStorage["jwt"] })
      .post(`${apiUrl}/faculty/${faculty_id}/departments`);
    const { statusText, status } = req;
    const res = await req.json();
    parseResponseError({ res, status, statusText });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addBiodata = async ({ toSend, examId }: any) => {
  const req = await api
    .body(toSend)
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .post(`${apiUrl}/exams/${examId}/biodatas`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const updateSingleBiodata = async ({ data, examId, biodataId }: any) => {
  const req = await api
    .body(data)
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .put(`${apiUrl}/exams/${examId}/biodatas/${biodataId}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const extendStudentTime = async ({ timeIncrease, userId }: any) => {
  const req = await api
    .body({ timeIncrease })
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .post(`${apiUrl}/users/${userId}`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};

export const updateAccount = async (update: any) => {
  const req = await api
    .body(update)
    .headers({ Authorization: "Bearer " + localStorage["jwt"] })
    .put(`${apiUrl}/me`);
  const { statusText, status } = req;
  const res = await req.json();
  parseResponseError({ res, status, statusText });
  return res.data;
};
