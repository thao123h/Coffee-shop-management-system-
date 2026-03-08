import axiosClient from "./axiosClient";

export const loginApi = async (username, password) => {
  try {
    const res = await axiosClient.post("/auth/signin", { username, password });
    return res.data;
  } catch (err) {
    console.error("login error:", err.response || err);
    throw err;
  }
};

export const registerApi = async (username, password, role) => {
  try {
    const res = await axiosClient.post("/auth/signup", { username, password, role });
    return res.data;
  } catch (err) {
    console.error("register error:", err.response || err);
    throw err;
  }
};