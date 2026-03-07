import axiosClient from "./axiosClient";

export const getAllProducts = async (page = 0, size = 10, search = "") => {
  try {
    const res = await axiosClient.get("/products", {
      params: {
        page: page,
        size: size,
        search: search,
      },
    });
    return res.data;
  } catch (err) {
    console.error("get products error:", err);
    throw err;
  }
};

export const getAllToppings = async () => {
  try {
    const res = await axiosClient.get("/toppings");
    return res.data;
  } catch (err) {
    console.error("get toppings error:", err);
    throw err;
  }
};
