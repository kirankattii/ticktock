import api from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export const loginApi = async (data: { email: string; password: string }) => {
  const res = await api.post("/user/login", data);
  return {
    user: {
      name: res.data.name,
      email: res.data.email,
      token: res.data.token,
      id: res.data.id,
    } as AuthUser,
  };
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/user/register", data);
  return {
    user: {
      name: res.data.name,
      email: res.data.email,
      token: res.data.token,
      id: res.data.id,
    } as AuthUser,
  };
};

export const logoutApi = async () => {
  await api.post("/user/logout");
};
