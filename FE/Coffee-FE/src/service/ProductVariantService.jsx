import axiosClient from "./axiosClient";

export const getProductVariantsByIdProduct = async (productId) => {
  try {
    const res = await axiosClient.get("/product-variants", {
      params: {
        productId: productId,
      },
    });

    return res.data;
  } catch (err) {
    console.error("get product variants error:", err);
    throw err;
  }
};