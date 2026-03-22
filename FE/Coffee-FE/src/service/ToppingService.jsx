import axiosClient from "./axiosClient";
export const getAllToppings = async (activeOnly = false) => {
  try {
    const endpoint = activeOnly ? "/toppings/active" : "/toppings";
    const res = await axiosClient.get(endpoint);
    return res.data;
  } catch (err) {
    console.error("get toppings error:", err);
    throw err;
  }
};
