import axiosClient from "./axiosClient";

export const getAllProducts = async () => {
  try {
    const res = await axiosClient.get("http://localhost:8080/api/products");
    return res.data;
  } catch (err) {
    console.error("get products error:", err);
    throw err;
  }
};

export const getAllToppings = async () => {
  try {
    const res = await axiosClient.get("http://localhost:8080/api/toppings");
    return res.data;
  } catch (err) {
    console.error("get toppings error:", err);
    throw err;
  }
};


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