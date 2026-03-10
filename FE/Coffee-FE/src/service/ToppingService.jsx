import axiosClient from "./axiosClient";
export const getAllToppings = async () => {
  try {
    const res = await axiosClient.get("/toppings");
    return res.data;
  } catch (err) {
    console.error("get toppings error:", err);
    throw err;
  }
};


