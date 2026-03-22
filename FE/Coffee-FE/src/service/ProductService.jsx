import axiosClient from "./axiosClient";

export const getAllProducts = async (page = 0, size = 10, keyword = "", activeOnly = false) => {
  try {
    const res = await axiosClient.get("/products", {
      params: {
        page: page,
        size: size,
        keyword: keyword,
        activeOnly: activeOnly,
      },
    });
    return res.data;
  } catch (err) {
    console.error("get products error:", err);
    throw err;
  }
};
