const api_url = "http://localhost:3001";

const app = {
  h: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage["jwt"] || ""}`,
  },
  headers: (obj: any) => {
    app.h = { ...app.h, ...obj };
    return app;
  },
  b: JSON.stringify({}),
  body: (obj: any) => {
    app.b = JSON.stringify(obj);
    return app;
  },
  gimme_body: () => {
    const body = app.b;
    app.b = JSON.stringify({});
    return body;
  },
  post: (url: string) => {
    return fetch(url, {
      method: "post",
      body: app.gimme_body(),
      headers: app.h,
    });
  },
  get: (url: string) => {
    return fetch(url, { method: "get", headers: app.h });
  },
  put: (url: string) => {
    return fetch(url, {
      method: "put",
      body: app.gimme_body(),
      headers: app.h,
    });
  },
  delete: (url: string) => {
    return fetch(url, {
      method: "delete",
      body: app.gimme_body(),
      headers: app.h,
    });
  },
};

export const verify_login = async () => {
  const jwt = localStorage["jwt"];
  const def = {
    matric: "",
  };
  if (!jwt) return def;
  try {
    const res = await app.get(`${api_url}/user`);
    if (res.status >= 400) {
      delete localStorage["jwt"];
      return def;
    }
    const user = await res.json();
    console.log(user);
    return user;
  } catch (e) {
    throw e;
  }
};

export const login = async ({ "matric-no": username, password }: any) => {
  try {
    const res = await app
      .body({ username, password })
      .post(`${api_url}/user/signin`);
    if (res.status >= 400) return { status: false };
    const user = await res.json();
    localStorage["jwt"] = user.jwt;
    return user;
  } catch (e) {
    throw e;
  }
};
