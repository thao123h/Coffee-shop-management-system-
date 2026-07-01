import axiosClient from "./axiosClient";

export const getProductVariantsByIdProduct = async (productId, activeOnly = false) => {
  try {
    const res = await axiosClient.get("/variants", {
      params: {
        productId: productId,
        activeOnly: activeOnly,
      },
    });

    return res.data;
  } catch (err) {
    console.error("get product variants error:", err);
    throw err;
  }
};