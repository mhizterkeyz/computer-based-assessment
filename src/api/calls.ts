export const api_url = `http://${window.location.hostname}:8000/api/v1`;

export const app = {
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
    app.h = { ...app.h, Authorization: `Bearer ${localStorage["jwt"] || ""}` };
    return fetch(url, {
      method: "post",
      body: app.gimme_body(),
      headers: app.h,
    });
  },
  get: (url: string) => {
    app.h = { ...app.h, Authorization: `Bearer ${localStorage["jwt"] || ""}` };
    return fetch(url, { method: "get", headers: app.h });
  },
  put: (url: string) => {
    app.h = { ...app.h, Authorization: `Bearer ${localStorage["jwt"] || ""}` };
    return fetch(url, {
      method: "put",
      body: app.gimme_body(),
      headers: app.h,
    });
  },
  delete: (url: string) => {
    app.h = { ...app.h, Authorization: `Bearer ${localStorage["jwt"] || ""}` };
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
    return user.data;
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
    localStorage["jwt"] = user.data.accessToken;
    return user.data;
  } catch (e) {
    throw e;
  }
};

// export
